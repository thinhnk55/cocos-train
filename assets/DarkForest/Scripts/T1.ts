import { _decorator, Component, Node, Button, log} from 'cc';
import { AudioManager } from '../../Scripts/Common/AudioManager';
import { Main } from '../../Scripts/Main';
const { ccclass, property } = _decorator;


@ccclass('DF-T1')
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
                    AudioManager.playSound('Sound/MultipleChoices/sentences/i-want-a-strawberry',
                    this.soundHanlder.bind(this));
                }
                if(index == 1){
                    AudioManager.playSound('Sound/MultipleChoices/sentences/i-want-a-banana',
                    this.soundHanlder.bind(this));
                }
                if(index == 2){
                    AudioManager.playSound('Sound/MultipleChoices/sentences/i-want-an-apple',
                    this.soundHanlder.bind(this));
                }
            });
        }
    }
    soundHanlder(path: string, duration: number){
        log("soundHandler:", path, duration);
    }

    // update(deltaTime: number) {
        
    // }
}

