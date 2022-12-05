import { _decorator, Component, Node, AudioSource, log, AssetManager, Prefab, instantiate} from 'cc';
import { AudioManager } from './Common/AudioManager';
import { PrefabManager } from './Common/PrefabManager';
import { ScreenManager } from './Common/ScreenManager';
const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {
    public static instance: Boot = null;
    @property({type:AudioSource}) 
    audioSource: AudioSource = null!
 
    start() {
        log('Boot start');
        AudioManager.instance().init(this.audioSource);
        Boot.instance = this;
        PrefabManager.instance().loadPrefab('Home', 
            'Prefabs/Home', 
            this.loadHome.bind(this)); 
    }

    loadHome(error:number) {
        if(error == 0){
            ScreenManager.instance().show('Home', 'Prefabs/Home');
        }
    }
}

