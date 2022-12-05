import { _decorator, Component, Node, Sprite, AudioSource, log, AudioClip} from 'cc';
import { AudioManager } from '../../Scripts/Common/AudioManager';
import { ScreenManager } from '../../Scripts/Common/ScreenManager';
const { ccclass, property } = _decorator;

@ccclass('DF-Gate')
export class Gate extends Component {
    @property({type:Sprite})
    background:Sprite = null;
    start() {
        this.background
        .node
        .on(Node.EventType.TOUCH_END, (event) => {
            log("Press Gate");
            AudioManager.instance().playSound('DarkForest', 'Resources/Sound/door-opening',
            this.soundHanlder.bind(this));
        });
    }
    soundHanlder(error: number, audioKey: string, audioClip: AudioClip){
        if(error == 0){
            this.scheduleOnce(function() {
                ScreenManager.instance().show('DarkForest', 'Prefabs/T1');
            }, Math.ceil(audioClip.getDuration()));
        }
    }
}

