import {log, native} from 'cc';
export class NativeHotupdate {
    static BASE_MANIFEST_URL:string = 'http://127.0.0.1:8080/remote-assets-compress/';
    am: native.AssetsManager = null;
    path:string;
    storagePath:string = null;
    
    onUpdateEnd: Function = null;
    onCheckUpdateEnd: Function = null;
    onUpdateProgress: Function = null;

    canRetry:boolean = false;
    canCheckupdate:boolean = false;

    prepare(path: string, onCheckUpdateEnd: Function, onUpdateProgress: Function, onUpdateEnd: Function){
        log('prepare', path);
        this.canRetry = false;
        this.path = path;
        this.storagePath = ((native.fileUtils ?
            native.fileUtils.getWritablePath() : '/') 
            + 'remote-assets/') 
            + path;
        let  projectManifestFile = this.storagePath + '/project.manifest';
        let isExist = native.fileUtils.isFileExist(projectManifestFile);
        log('isExist?', isExist, projectManifestFile);
        let manifestData = '';
        if(isExist){
            manifestData = native.fileUtils.getStringFromFile(projectManifestFile);
        }else{
            manifestData = this.defaultManifest(path);
        }
        let manifest = new native.Manifest(manifestData, this.storagePath);
        this.am = new native.AssetsManager('', this.storagePath, 
                this.versionCompareHandle.bind(this));
        let result = this.am.loadLocalManifest(manifest, this.storagePath);
        this.am.setVerifyCallback(function (path: string, asset: native.ManifestAsset) {
            return true;
        });
        this.onCheckUpdateEnd = onCheckUpdateEnd;
        this.onUpdateProgress = onUpdateProgress;
        this.onUpdateEnd = onUpdateEnd;
        this.canCheckupdate = true;
    }

    debug(){
        log('state', this.am.getState(), native.AssetsManager.State.UNINITED);
        log('version', this.am.getLocalManifest().getVersion());
    }

    defaultManifest(path:string):string{
        let packageUrl = NativeHotupdate.BASE_MANIFEST_URL + path + '/';
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
        let manifestData = JSON.stringify(object);
        return manifestData;
    }

    versionCompareHandle(versionA: string, versionB: string) {
        if(versionA == versionB){
            return 0;
        }
        return -1;
    };

    checkUpdate(){
        this.am.setEventCallback(this.checkUpdateCallBack.bind(this));
        this.am.checkUpdate();
    }
    
    checkUpdateCallBack(event: any){
        switch (event.getEventCode()) {            
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_NO_LOCAL_MANIFEST');
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_DOWNLOAD_MANIFEST');
                this.canCheckupdate = true;
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_PARSE_MANIFEST');
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                log('checkUpdate', this.path, 'NEW_VERSION_FOUND');
                this.canCheckupdate = false;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                log('checkUpdate', this.path, 'ALREADY_UP_TO_DATE');
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                log('checkUpdate', this.path, 'UPDATE_PROGRESSION');
                break;
            case native.EventAssetsManager.ASSET_UPDATED:
                log('checkUpdate', this.path, 'ASSET_UPDATED');
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                log('checkUpdate', this.path, 'ERROR_UPDATING');
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                log('checkUpdate', this.path, 'UPDATE_FINISHED');
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                log('checkUpdate', this.path, 'UPDATE_FINISHED');
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                log('checkUpdate', this.path, 'ERROR_DECOMPRESS');
                break;
        }
        this.onCheckUpdateEnd(this.path, event);
    }

    hotUpdate(){
        this.am.setEventCallback(this.hotupdateCallBack.bind(this));
        this.am.update();
    }

    hotupdateCallBack(event: any){
        switch (event.getEventCode()) {            
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_NO_LOCAL_MANIFEST');
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_DOWNLOAD_MANIFEST');
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                log('checkUpdate', this.path, 'ERROR_PARSE_MANIFEST');
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                log('checkUpdate', this.path, 'NEW_VERSION_FOUND');
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                log('checkUpdate', this.path, 'ALREADY_UP_TO_DATE');
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                log('checkUpdate', this.path, 'UPDATE_PROGRESSION');
                this.onUpdateProgress(this.path, event);
                return;
            case native.EventAssetsManager.ASSET_UPDATED:
                log('checkUpdate', this.path, 'ASSET_UPDATED');
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                log('checkUpdate', this.path, 'ERROR_UPDATING');
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                log('checkUpdate', this.path, 'UPDATE_FINISHED');
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                log('checkUpdate', this.path, 'UPDATE_FAILED');
                this.canRetry = true;
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                log('checkUpdate', this.path, 'ERROR_DECOMPRESS');
                break;
        }  
        this.onUpdateEnd(this.path, event); 
    }
    retry(){
        this.debug();
        if(this.canRetry){
            this.am.downloadFailedAssets();
        }
    }
}
