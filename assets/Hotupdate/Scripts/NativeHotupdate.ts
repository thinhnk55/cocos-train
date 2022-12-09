import {log, native} from 'cc';
export class NativeHotupdate {
    am: native.AssetsManager = null;
    storagePath:string = null;
    action:number = NativeHotupdateAction.NONE;

    updateListener: Function = null;
    checkUpdateListener: Function = null;
    bundleName:string = null;

    prepareBundle(buldleName: string, checkUpdateListener: Function, updateListener: Function){
        log('prepareBundle', buldleName);
        this.bundleName = buldleName;
        let versionManifest = ((native.fileUtils ?
            native.fileUtils.getWritablePath() : '/') 
            + 'remote-assets/') 
            + buldleName 
            + '/project.manifest';
        let isExist = native.fileUtils.isFileExist(versionManifest);
        if(isExist){
            log('version.manifest exist');
            let versionManifestStr = native.fileUtils.getStringFromFile(versionManifest);
            this.prepare(versionManifestStr, buldleName, checkUpdateListener, updateListener);
        }else{
            log('version.manifest not exist');
            this.prepare('', buldleName, checkUpdateListener, updateListener);
        }
    }
        
    prepare(manifestData: string, path: string, 
        checkUpdateListener: Function, updateListener: Function){
        log('prepare: ', path);
        this.storagePath = native.fileUtils.getWritablePath() + 'remote-assets/' + path;       
        this.am = new native.AssetsManager('', this.storagePath, 
            this.versionCompareHandle.bind(this));
        if(manifestData == ''){
            this.am.loadLocalManifest(this.defaultManifest(path), this.storagePath);
        }else{
            let manifest = new native.Manifest(manifestData, this.storagePath);
            this.am.loadLocalManifest(manifest, this.storagePath);
        }
        this.am.setVerifyCallback(function (path: string, asset: native.ManifestAsset) {
            log('hotupdate setVerifyCallback:', path, asset.path, asset.compressed);
            var compressed = asset.compressed;
            if (compressed) {
                return true;
            }else {
                return true;
            }
        });
        this.updateListener = updateListener;
        this.checkUpdateListener = checkUpdateListener;
        log('prepare: OK', path, this.storagePath);
    }

    defaultManifest(path:string):native.Manifest{
        let packageUrl = 'http://127.0.0.1:8080/remote-assets-compress/' + path + '/';
        let projectUrl = packageUrl + path + '_project.manifest';
        let versionUrl = packageUrl + path + '_version.manifest';
        var object = {
            "packageUrl": packageUrl,
            "remoteManifestUrl": projectUrl,
            "remoteVersionUrl": versionUrl,
            "version": "1.0.0",
            "assets": {},
            "searchPaths": []
        };
        let customManifestStr = JSON.stringify(object);
        let manifest = new native.Manifest(customManifestStr, this.storagePath);
        return manifest;
    }

    versionCompareHandle(versionA: string, versionB: string) {
        log('versionCompareHandle:', versionA, versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                log('versionCompareHandle', versionA, versionB, 0);
                continue;
            }
            else {
                log('versionCompareHandle', versionA, versionB, a-b);
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            log('versionCompareHandle', versionA, versionB, -1);
            return -1;
        }
        else {
            log('versionCompareHandle', versionA, versionB, 0);
            return 0;
        }
    };

    checkUpdate(){
        log('checkUpdate');
        if (this.action == 1) {
            log('checkUpdate 1');
            return 1 ;
        }
        if (!this.am.getLocalManifest()) {
            log('checkUpdate 2');
            return 2;
        }
        if(!this.am.getLocalManifest().isLoaded()){
            log('checkUpdate 3');
            return 3;
        }
        this.am.setEventCallback(this.checkUpdateCallBack.bind(this));
        this.am.checkUpdate();
        this.action = NativeHotupdateAction.CHECKUPDATE;
        log('checkUpdate OK');
        return 0;
    }
    
    checkUpdateCallBack(event: any){
        log('checkUpdateCallBack', event.getEventCode());
        let error = NativeHotupdateCheckUpdateError.NONE;
        switch (event.getEventCode()) {            
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                log('native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST');
                error = NativeHotupdateCheckUpdateError.ERROR_NO_LOCAL_MANIFEST;
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                log('native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST');
                error = NativeHotupdateCheckUpdateError.ERROR_DOWNLOAD_MANIFEST;
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                log('native.EventAssetsManager.ERROR_PARSE_MANIFEST');
                error = NativeHotupdateCheckUpdateError.ERROR_PARSE_MANIFEST;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                log('native.EventAssetsManager.ALREADY_UP_TO_DATE');
                error = NativeHotupdateCheckUpdateError.ALREADY_UP_TO_DATE;
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                log('native.EventAssetsManager.NEW_VERSION_FOUND');
                error = NativeHotupdateCheckUpdateError.NEW_VERSION_FOUND;
                break;
            default:
                log('native.EventAssetsManager.default', event.getEventCode());
                break;
        }
        this.am.setEventCallback(null!);
        this.checkUpdateListener(this.bundleName, error);
        this.action = NativeHotupdateAction.NONE;
        log('checkUpdateCallBack OK');
    }

    hotUpdate(){
        log('hoy update start');
        this.am.setEventCallback(this.hotupdateCallBack.bind(this));
        this.am.update();
        this.action = NativeHotupdateAction.HOTUPDATE;
        log('hoy update run ...');
    }
    hotupdateCallBack(event: any){
        log('hotupdateCallBack');
        let success = false;
        let canRetry = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                log('native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST');
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                log('native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST');
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                log('native.EventAssetsManager.ERROR_PARSE_MANIFEST');
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                log('native.EventAssetsManager.ALREADY_UP_TO_DATE');
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                log('native.EventAssetsManager.UPDATE_FINISHED');
                success = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                log('native.EventAssetsManager.UPDATE_FAILED');
                this.action = NativeHotupdateAction.NONE;
                canRetry = true;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                log('native.EventAssetsManager.ERROR_UPDATING');
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                log('native.EventAssetsManager.ERROR_DECOMPRESS');
                break;
            default:
                log('native.EventAssetsManager.default', event.getEventCode());
                break;
        }
        log('hotupdateCallBack success canRetry', success, canRetry);
        if (success) {
            var searchPaths = native.fileUtils.getSearchPaths();
            var newPaths = this.am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            searchPaths = searchPaths.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            });
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            native.fileUtils.setSearchPaths(searchPaths);
            this.am.setEventCallback(null!);
        }   
        this.action = NativeHotupdateAction.NONE;    
        this.updateListener(this.bundleName, success, canRetry);
        log('hotupdateCallBack FINISH');
    }
    retry(){
        if(this.action == NativeHotupdateAction.NONE){
            this.am.downloadFailedAssets();
        }
    }
}

export enum NativeHotupdateAction {
    NONE = 0,
    CHECKUPDATE = 1,
    HOTUPDATE = 2
}

export  enum NativeHotupdateCheckUpdateError {
    NONE = 0,
    ERROR_NO_LOCAL_MANIFEST = 1,
    ERROR_DOWNLOAD_MANIFEST = 2,
    ERROR_PARSE_MANIFEST = 3,
    ALREADY_UP_TO_DATE = 4,
    NEW_VERSION_FOUND = 5
}

export  enum NativeHotupdateError {
    NONE = 0,
    FINISH = 1,
    FAILED = 2,
    RETRY = 3,
}
