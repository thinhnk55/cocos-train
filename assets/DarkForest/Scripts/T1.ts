import { _decorator, Component, Node, Button, log, sp, assetManager, instantiate} from 'cc';
import { Boot } from '../../Scripts/Boot';
import { AudioManager } from '../../Scripts/Common/AudioManager';
import { BundleManager } from '../../Scripts/Common/BundleManager';
import { ScreenManager } from '../../Scripts/Common/ScreenManager';
import { SpineManager } from '../../Scripts/Common/SpineManager';
const { ccclass, property } = _decorator;


@ccclass('DF-T1')
export class T1 extends Component {
    @property({type:[Button]})
    menu: Button[] = [];
    @property({type:[Button]})
    fruits: Button[] = [];
    @property({type:sp.Skeleton})
    monster: sp.Skeleton = null;

    loadSpineTest(){
        SpineManager.instance().loadSpine(
            'DarkForest','Resources/Animation/spine/spineboy/spineboy-pro',
            (error:number, spineKey:string, spineData?:sp.SkeletonData)=>{
                log('loadSpineTest', error, spineKey);
                if(error == 0){
                    log('create spine 1');
                    let spine = new sp.Skeleton();
                    log('create spine 2');
                    spine.skeletonData = spineData;
                    log('create spine 3');
                    // let node = instantiate(spine);
                    // this.node.addChild(node);
                    log('create spine 4');
                }
            }
        )
    }

    start() {
        this.loadSpineTest();
        for(var i = 0; i < this.menu.length; i++){
            const index = i;
            this.menu[index]
            .node
            .on(Node.EventType.TOUCH_END, (event) => {
                console.log("Press Menu", index);
                if(index == 0){
                    ScreenManager.instance().show('Home', 'Prefabs/Home');
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
                    AudioManager.instance().playSound('DarkForest','Resources/Sound/i-want-a-strawberry');
                    this.monster.setAnimation(0, 'an', true);
                }
                if(index == 1){
                    AudioManager.instance().playSound('DarkForest', 'Resources/Sound/i-want-a-banana');
                    this.monster.setAnimation(0, 'nghi', true);
                }
                if(index == 2){
                    AudioManager.instance().playSound('DarkForest', 'Resources/Sound/i-want-an-apple');
                    this.monster.setAnimation(0, 'sai', true);
                }
            });
        }
    }
}

