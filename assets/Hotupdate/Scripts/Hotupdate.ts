import { _decorator, Component, ProgressBar, native, Label, log, Button, Node, Light } from 'cc';
import {NATIVE} from 'cc/env';
import { hotupdateManifest } from './manifest';
const { ccclass, property } = _decorator;

@ccclass('Hotupdate')
export class Hotupdate extends Component {
    @property({type:Label})
    info: Label = null!;
    @property({type:Label})
    fileInfo: Label = null!;
    @property({type:Label})
    byteInfo: Label = null!;

    @property({type:ProgressBar})
    fileProgress: ProgressBar = null!;
    @property({type:ProgressBar})
    byteProgress: ProgressBar = null!;

    @property({type:Button})
    checkButton:Button = null!;
    @property({type:Button})
    updateButton:Button = null!;
    @property({type:Button})
    retryButton:Button = null!;


    private action:number = 0;
    private _canRetry = false;
    private _storagePath = '';
    private _am: native.AssetsManager = null!;
    private _checkListener = null;
    private _updateListener = null;
    private _failCount = 0;
    onLoad() {
        console.log('start');
        if (NATIVE) {
            this._storagePath = ((native.fileUtils ?
                 native.fileUtils.getWritablePath() : '/') + 'remote-assets');
            log('Storage path for remote asset : ' + this._storagePath);
            this.info.string = this._storagePath;
            this._am = 
                new native.AssetsManager('', 
                this._storagePath, this.versionCompareHandle.bind(this));
            this.info.string = '_am init';
            var info = this.info;
            this._am.setVerifyCallback(function (path: string, asset: any) {
                // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
                var compressed = asset.compressed;
                // Retrieve the correct md5 value.
                var expectedMD5 = asset.md5;
                // asset.path is relative path and path is absolute.
                var relativePath = asset.path;
                // The size of asset file, but this value could be absent.
                var size = asset.size;
                if (compressed) {
                    info.string = "Verification passed : " + relativePath;
                    return true;
                }
                else {
                    info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                    return true;
                }
            });
            this.info.string = 'Hot update is ready, please check or directly update.';
            this.fileProgress.progress = 0;
            this.byteProgress.progress = 0;

            this.checkButton
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                info.string = 'checkButton pressed';
                this.checkUpdate();
            });
            this.updateButton
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                info.string = 'updateButton pressed';
                this.hotUpdate();
            });
            this.retryButton
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                info.string = 'retryButton pressed';
                this.retry();
            });
        }
    }
    versionCompareHandle(versionA: string, versionB: string) {
        log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    };

    checkUpdate() {
        log('checkUpdate call');
        if (this.action == 1) {
            log('checking update');
            return;
        }
        if (this.action == 2) {
            log('updating');
            return;
        }
        this.loadCustomManifest();
        if (!this._am.getLocalManifest() 
        || !this._am.getLocalManifest().isLoaded()) {
            this.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        this.action = 1;
        this.info.string = 'checking update ...';
        log('checkUpdate DONE');
    }
    checkCb(event: any) {
        log('check update callback');
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = "No local manifest file found, hot update skipped.";
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = "Fail to download manifest file, hot update skipped.";
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = "Already up to date with the latest remote version.";
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                this.info.string = 'New version found, please try to update.';
                this.fileInfo.string = Math.ceil(this._am.getTotalBytes() / 1024) + 'kb';
                this.byteInfo.string = this._am.getTotalFiles() + 'files)';
                this.fileProgress.progress = 0;
                this.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        this._am.setEventCallback(null!);
        this._checkListener = null;
        this.action = 0;
        log('check update callback DONE');
    }

    updateCb(event: any) {
        log('update callback');
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                this.byteProgress.progress = event.getPercent();
                this.fileProgress.progress = event.getPercentByFile();

                this.fileInfo.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.byteInfo.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                log(this.fileInfo.string, this.byteInfo.string);
                var msg = event.getMessage();
                if (msg) {
                    this.info.string = 'Updated file: ' + msg;
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                this.info.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                this.info.string = 'Update failed. ' + event.getMessage();
                this.action = 0;
                this._canRetry = true;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                this.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                this.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            this.action = 0;
            log('update failed');
        }

        if (needRestart) {
            log('update neet restart');
            this._am.setEventCallback(null!);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = native.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            native.fileUtils.setSearchPaths(searchPaths);
        }
    }

    retry() {
        if (this.action == 0 && this._canRetry) {
            this._canRetry = false;
            this.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    }

    hotUpdate() {
        if (this._am && this.action == 0) {
            this.info.string = "Hot updating ..."
            this._am.setEventCallback(this.updateCb.bind(this));
            this.loadCustomManifest();
            this._failCount = 0;
            this._am.update();
            this.action = 2;
        }
    }



    loadCustomManifest() {
        log('loadCustomManifest ...');
        if (this._am.getState() === native.AssetsManager.State.UNINITED) {
            var manifest = new native.Manifest(hotupdateManifest, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            this.info.string = 'Using custom manifest';
            log('loadCustomManifest ok');
        }
    }
}


