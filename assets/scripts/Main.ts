import { _decorator, Component, Node, AudioSource, log } from 'cc';
const { ccclass, property } = _decorator;
import { AudioManager } from './Common/AudioManager';
@ccclass('Main')
export class Main extends Component {
    public static instance: Main = null;

    @property({type:AudioSource}) 
    audioSource: AudioSource = null!
 
    start() {
        AudioManager.init(this.audioSource);
        Main.instance = this;
        log('Main start');
    }
}

