import { _decorator, Component, Node, Prefab } from 'cc';
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
    
    start() {
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

