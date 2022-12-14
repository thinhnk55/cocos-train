import { _decorator, Component, Node, Button, log} from 'cc';
import { ScreenManager } from '../../Scripts/Common/ScreenManager';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {
    @property({type:[Button]})
    menu: Button[] = [];
    @property({type:[Button]})
    subjects: Button[] = [];

    start() {
        for(var i = 0; i < this.menu.length; i++){
            const index = i;
            this.menu[index]
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                console.log("Press Menu", index);
            });
        }
        for(var i = 0; i < this.subjects.length; i++){
            const index = i;
            this.subjects[index]
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                console.log("Press Subject", index);
                if(index == 0){   
                    ScreenManager.instance().show('DarkForest', 'Prefabs/Gate');
                }
            });
        }
    }
    // update(deltaTime: number) {
        
    // }
}

