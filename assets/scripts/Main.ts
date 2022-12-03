import { _decorator, Component, Node, AudioSource, log } from 'cc';
import { AudioManager } from './Common/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    public static instance: Main = null;

    @property({type:AudioSource}) 
    audioSource: AudioSource = null!
 
    start() {
        AudioManager.init(this.audioSource);
        Main.instance = this;
    }
}

