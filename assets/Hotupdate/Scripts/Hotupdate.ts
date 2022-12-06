import { _decorator, Component, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hotupdate')
export class Hotupdate extends Component {
    @property({type:ProgressBar})
    progressBar: ProgressBar;

    start() {

    }

    update(deltaTime: number) {
        this.progressBar.progress += 0.5*deltaTime;
        if(this.progressBar.progress > 1){
            this.progressBar.progress = 0;
        }
    }
}


