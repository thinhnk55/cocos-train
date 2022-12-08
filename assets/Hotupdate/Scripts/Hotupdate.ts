import { _decorator, Component, ProgressBar, Label, Button, Node, EditBox, log} from 'cc';
import { NativeHotupdate } from './NativeHotupdate';
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
    prepareButton:Button = null!;
    @property({type:Button})
    checkButton:Button = null!;
    @property({type:Button})
    updateButton:Button = null!;
    @property({type:Button})
    retryButton:Button = null!;

    @property({type:EditBox})
    bundleNameInput:EditBox = null!;

    nativeHotupdate:NativeHotupdate = null;
    
    onLoad() {       
        this.bundleNameInput.string = 'Test';
        this.nativeHotupdate = new NativeHotupdate();
        let info = this.info;
        this.prepareButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let bundle = this.bundleNameInput.string;
            info.string = 'prepareButton pressed ' + bundle;
            this.nativeHotupdate.prepareBundle(bundle, this.onCheckUpdate, this.onHotupdate);
        });

        this.checkButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let bundle = this.bundleNameInput.string;
            info.string = 'checkButton pressed ' + bundle;
            let result = this.nativeHotupdate.checkUpdate();
            log('check update: ', result);
        });
        this.updateButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let bundle = this.bundleNameInput.string;
            info.string = 'updateButton pressed ' + bundle;
            this.nativeHotupdate.hotUpdate();
        });
        this.retryButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let bundle = this.bundleNameInput.string;
            info.string = 'retryButton pressed ' + bundle;
            this.nativeHotupdate.retry();
        });
    }
    onCheckUpdate(bundle:string, error:number){
        log('onCheckUpdate', bundle, error);
    }
    onHotupdate(bundle:string, success:boolean, retry: boolean){
        log('onHotupdate', bundle, success, retry);
    }
}


