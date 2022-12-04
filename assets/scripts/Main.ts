import { _decorator, Component, Node, AudioSource, log, AssetManager, Prefab, instantiate} from 'cc';
const { ccclass, property } = _decorator;
import { AudioManager } from './Common/AudioManager';
import { BundleManager } from './Common/BundleManager';
@ccclass('Main')
export class Main extends Component {
    public static instance: Main = null;

    @property({type:AudioSource}) 
    audioSource: AudioSource = null!
 
    start() {
        log('Main start');
        AudioManager.init(this.audioSource);
        Main.instance = this;
        BundleManager.instance().loadBundle('Home', 'Prefabs/Home',
        this.loadHome.bind(this)); 
    }
    loadHome(error:number) {
        if(error == 0){
            BundleManager.instance().show('Home/Prefabs/Home');
        }else{
            log('load Home Error');
        }
    }
}

