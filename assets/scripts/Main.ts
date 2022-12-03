import { _decorator, Component, Node, AudioSource, log } from 'cc';
import { AudioManager } from './base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    
    public static instance: Main = null;

    @property({type:Node})
    home:Node = null;
    @property({type:Node})
    gate:Node = null;
    @property({type:Node})
    multiple1:Node = null;

    @property({type:AudioSource}) 
    audioSource: AudioSource = null!

    onEnable () {
        // Register the started event callback
        this.audioSource.node.on(AudioSource.EventType.STARTED, 
            this.audioStarted, 
            this);
        // Register the ended event callback
        this.audioSource.node.on(AudioSource.EventType.ENDED, 
            this.audioEnded, 
            this);
        log("Main onEnable", this.audioSource.node.active);
    }

    onDisable () {
        this.audioSource
        .node.off(AudioSource.EventType.STARTED, 
            this.audioStarted, this);
        this.audioSource.node.off(AudioSource.EventType.ENDED, 
            this.audioEnded, this);
        log("Main onDisable");
    }

    audioStarted(){
        log("audio started");
    }
    audioEnded(){
        log("audio ended");
    }

    
    start() {
        AudioManager.init(this.audioSource);
        Main.instance = this;
        this.showHome();
    }
    showHome(){
        this.home.active = true;
        this.gate.active = false;
        this.multiple1.active = false;
    }
    showGate(){
        this.home.active = false;
        this.gate.active = true;
        this.multiple1.active = false;
    }
    showMultiple1(){
        this.home.active = false;
        this.gate.active = false;
        this.multiple1.active = true;
    }

    // update(deltaTime: number) {
        
    // }
}

