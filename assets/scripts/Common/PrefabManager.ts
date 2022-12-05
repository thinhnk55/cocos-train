import {Prefab, AssetManager, log} from "cc";
import { BundleManager } from "./BundleManager";

export class PrefabManager {
    private static ins: PrefabManager = null;
    static instance():PrefabManager{
        if(!PrefabManager.ins){
            PrefabManager.ins = new PrefabManager();
        }
        return PrefabManager.ins;
    }    

    
    private constructor(){
        this.prefabMap = new Map<string, Prefab>();
        log('PrefabManager init');
    }

    private prefabMap: Map<string, Prefab> = null;
    getPrefab(prefabKey: string): Prefab{
        return this.prefabMap.get(prefabKey);        
    }

    loadPrefab(bundleName:string, prefabPath: string, calback?:Function){
        const prefabKey = bundleName + '/' + prefabPath;
        let prefab = this.prefabMap.get(prefabKey);
        if(prefab){
            if(calback) calback(0, prefab);
            return;
        }
        BundleManager.instance().loadBundle(bundleName, (err:number, bundle: AssetManager.Bundle) => {
            if(err != 0){
                if(calback) calback(1, null);
                return;
            }
            bundle.load(prefabPath, Prefab, (err, prefab) => {
                if (err) {
                    log('loadPrefab error', prefabPath, err);
                    if(calback) calback(2, null);
                    return;
                }
                PrefabManager.ins.prefabMap.set(prefabKey, prefab);
                if(calback) calback(0, prefab);
                log('loadPrefab ok', prefabKey);
            });
        });
    }
}