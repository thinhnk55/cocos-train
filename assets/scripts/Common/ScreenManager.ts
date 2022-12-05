import {Prefab, Node, instantiate, log} from "cc";
import { Boot } from "../Boot";
import { PrefabManager } from "./PrefabManager";

export class ScreenManager {
    private static ins: ScreenManager = null;
    static instance():ScreenManager{
        if(!ScreenManager.ins){
            ScreenManager.ins = new ScreenManager();
        }
        return ScreenManager.ins;
    }    
    private constructor(){
        this.screenMap = new Map<string, Node>(); 
        log('ScreenManager init');
    }

    private screenMap: Map<string, Node> = null;
    private currentScreen: Node = null;

    show(bundle:string, prefabPath: string, callback?: Function){
        let screenKey = bundle + '/' + prefabPath;
        let screen = this.screenMap.get(screenKey);
        if(screen){
            this.showSreen(screen);
            if(callback) callback(0, screen);
            return;
        }
        PrefabManager.instance().loadPrefab(bundle, prefabPath, (error: number, prefab: Prefab)=>{
            if(error != 0){
                if(callback) callback(error, null);
            }else{
                let screen = instantiate(prefab);
                Boot.instance.node.addChild(screen);
                this.showSreen(screen);
                if(callback) callback(0, screen);
            }
        });
    }
    
    private showSreen(screen: Node){
        if(this.currentScreen){
            this.currentScreen.active = false;
        }
        this.currentScreen = screen;
        this.currentScreen.active = true;
        return;
    }
}