import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;
import {Main} from './Main';

@ccclass('MultipleChoices1')
export class MultipleChoices1 extends Component {
    @property({type:[Button]})
    menu: Button[] = [];
    @property({type:[Button]})
    fruits: Button[] = [];

    start() {
        for(var i = 0; i < this.menu.length; i++){
            const index = i;
            this.menu[index]
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                console.log("Press Menu", index);
                if(index == 0){
                    Main.instance.showHome();
                }
            });
        }
        for(var i = 0; i < this.fruits.length; i++){
            const index = i;
            this.fruits[index]
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                console.log("Press fruits", index);
                if(index == 0){
                    
                }
            });
        }
    }

    // update(deltaTime: number) {
        
    // }
}

