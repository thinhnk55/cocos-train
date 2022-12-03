import { _decorator, Component, Node, Sprite, AudioSource, log} from 'cc';
import { AudioManager } from './base/AudioManager';
const { ccclass, property } = _decorator;
import { Main } from './Main';

@ccclass('Gate')
export class Gate extends Component {
    @property({type:Sprite})
    background:Sprite = null;
    start() {
        this.background
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            log("Press Gate");
            AudioManager.playSound('Sound/Gate/door-opening',
            this.soundHanlder.bind(this));
        });
        log("Gate start");  
    }
    soundHanlder(path: string, duration: number){
        log("soundHandler:", path, duration);
        this.scheduleOnce(function() {
            Main.instance.showMultiple1();
        }, duration);
    }

    // update(deltaTime: number) {
        
    // }
}

