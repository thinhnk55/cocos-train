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
    pathNameInput:EditBox = null!;

    nativeHotupdate:NativeHotupdate = null;
    
    onLoad() {       
        this.pathNameInput.string = 'loading';
        this.nativeHotupdate = new NativeHotupdate();
        let info = this.info;
        this.prepareButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let path = this.pathNameInput.string;
            info.string = 'prepareButton pressed ' + path;
            this.nativeHotupdate.prepare(path, this.onCheckUpdateEnd, this.onUpdateProgress, this.onUpdateEnd);
        });

        this.checkButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let path = this.pathNameInput.string;
            info.string = 'checkButton pressed ' + path;
            this.nativeHotupdate.checkUpdate();
        });
        this.updateButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let path = this.pathNameInput.string;
            info.string = 'updateButton pressed ' + path;
            let result = this.nativeHotupdate.hotUpdate();
        });
        this.retryButton
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            let path = this.pathNameInput.string;
            info.string = 'retryButton pressed ' + path;
            this.nativeHotupdate.retry();
        });
    }
    onCheckUpdateEnd(path:string, event:any){
        log('onCheckUpdateEnd', path, event.getEventCode());
    }
    onUpdateProgress(path:string, event:any){
        log('onUpdateProgress', path, event.getEventCode());
    }
    onUpdateEnd(path:string, event:any){
        log('onUpdateEnd', path, event.getEventCode());
    }
}


