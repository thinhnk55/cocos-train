import { _decorator, Component, Node, Sprite } from 'cc';
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
            console.log("Press Gate");
            Main.instance.showHome();
        });
    }

    update(deltaTime: number) {
        
    }
}

