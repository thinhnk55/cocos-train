import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    
    public static instance: Main = null;

    @property({type:Node})
    home:Node = null;
    @property({type:Node})
    gate:Node = null;
    start() {
        Main.instance = this;
        this.showHome();
    }
    showHome(){
        this.home.active = true;
        this.gate.active = false;
    }
    showGate(){
        this.home.active = false;
        this.gate.active = true;
    }

    update(deltaTime: number) {
        
    }
}

