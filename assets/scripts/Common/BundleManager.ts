import { _decorator, Node, Prefab, assetManager, instantiate, log, AssetManager} from 'cc';
const { ccclass, property } = _decorator;
import {Main} from '../Main';

export class BundleManager{
    getBundle(bundleName: string):AssetManager.Bundle {
        throw new Error("Method not implemented.");
    }
    private static ins: BundleManager = null;
    static instance():BundleManager{
        if(!BundleManager.ins){
            BundleManager.ins = new BundleManager();
        }
        return BundleManager.ins;
    }    

    private constructor(){
        this.prefabMap = new Map<string, Node>();
        log('BundleManager init');
    }

    private bundleMap: Map<string, AssetManager.Bundle> = null;
    private prefabMap: Map<string, Node> = null;
    private currentTop: Node = null;

    loadBundle(bundleName:string, prefabPath: string, calback:Function){
        const prefabKey = bundleName + '/' + prefabPath;
        log('loadBundle:', prefabKey);
        let node = this.prefabMap.get(prefabKey);
        if(node){
            calback(0);
            return;
        }
        assetManager.loadBundle(bundleName, (err, bundle) => {
            bundle.load(prefabPath, Prefab, function (err, prefab) {
                if(err){
                    calback(1);
                    return;
                }
                BundleManager.ins.bundleMap.set(bundleName, bundle);
                let newNode = instantiate(prefab);
                Main.instance.node.addChild(newNode);
                BundleManager.ins.prefabMap.set(prefabKey, newNode);
                log('add prefab', prefabPath);
                calback(0);
            });
        });
    }

    show(prefabKey:string){
        let node = this.prefabMap.get(prefabKey);
        if(node){
            if(this.currentTop){
                this.currentTop.active = false;
            }
            this.currentTop = node;
            this.currentTop.active = true;
        }
        log('show', prefabKey);
    }
}