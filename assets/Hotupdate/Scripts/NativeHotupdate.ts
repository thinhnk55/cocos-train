import { native} from 'cc';
export class NativeHotupdate {
    am: native.AssetsManager = null;
    storagePath:string = null;
    action:number = NativeHotupdateAction.NONE;
    updateListener: Function = null;
    canRetry: boolean;
    
    prepare(manifestUrl: string,path: string, updateListener: Function){
        this.storagePath = ((native.fileUtils ?
            native.fileUtils.getWritablePath() : '/') + 'remote-assets') + path;       
        this.am = new native.AssetsManager(manifestUrl, this.storagePath, 
            this.versionCompareHandle.bind(this));
        this.am.setVerifyCallback(function (path: string, asset: native.ManifestAsset) {
            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            if (compressed) {
                return false;
            }else {
                return true;
            }
        });
        this.updateListener = updateListener;
    }

    versionCompareHandle(versionA: string, versionB: string) {
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

    checkUpdate(){
        if (this.action == 1) {
            return 1 ;
        }
        if (!this.am.getLocalManifest()) {
            return 2;
        }
        if(this.am.getLocalManifest().isLoaded()){
            return 3;
        }
        this.am.setEventCallback(this.checkUpdateCallBack.bind(this));
        this.am.checkUpdate();
        this.action = NativeHotupdateAction.CHECKUPDATE;
        return 0;
    }
    
    checkUpdateCallBack(event: any){
        let error = NativeHotupdateCheckUpdateError.NONE;
        switch (event.getEventCode()) {            
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                error = NativeHotupdateCheckUpdateError.ERROR_NO_LOCAL_MANIFEST;
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                error = NativeHotupdateCheckUpdateError.ERROR_DOWNLOAD_MANIFEST;
                break;
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                error = NativeHotupdateCheckUpdateError.ERROR_PARSE_MANIFEST;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                error = NativeHotupdateCheckUpdateError.ALREADY_UP_TO_DATE;
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                error = NativeHotupdateCheckUpdateError.NEW_VERSION_FOUND;
                break;
            default:
                return;
        }
        this.am.setEventCallback(null!);
        this.updateListener(NativeHotupdateAction.CHECKUPDATE, error);
        this.action = NativeHotupdateAction.NONE;
    }

    hotUpdate(){
        this.am.setEventCallback(this.hotupdateCallBack.bind(this));
        this.am.update();
        this.action = NativeHotupdateAction.HOTUPDATE;
    }
    hotupdateCallBack(event: any){
        let success = true;
        let finish = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                success = false;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                success = false;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                success = false;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                success = false;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                this.action = NativeHotupdateAction.NONE;
                this.canRetry = true;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                success = false;
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                success = false;
                break;
            default:
                break;
        }
        if (success) {
            this.am.setEventCallback(null!);
            var searchPaths = native.fileUtils.getSearchPaths();
            var newPaths = this.am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            native.fileUtils.setSearchPaths(searchPaths);
        }else{
            this.am.setEventCallback(null!);
            this.action = NativeHotupdateAction.NONE;
            this.updateListener(NativeHotupdateAction.HOTUPDATE);
        }       
    }

    retry(){
        if(this.action == NativeHotupdateAction.NONE && this.canRetry){
            this.canRetry = false;
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
    ERROR_NO_LOCAL_MANIFEST = 1,
    ERROR_DOWNLOAD_MANIFEST = 2,
    ERROR_PARSE_MANIFEST = 3,
    ALREADY_UP_TO_DATE = 4,
    NEW_VERSION_FOUND = 5
}