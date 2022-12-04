import { assert, assetManager, AudioClip, AudioSource, log } from "cc";
import { BundleManager } from "./BundleManager";

export class AudioManager {
    public static audioSource?: AudioSource;
    public static cachedAudioClipMap: Record<string, AudioClip> = {};

    // init AudioManager in GameRoot component.
    public static init (audioSource: AudioSource) {
        log('Init AudioManager !');
        AudioManager.audioSource = audioSource;
    }

    public static playMusic () {
        const audioSource = AudioManager.audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        audioSource.play();
    }

    public static playSound(bundleName:string, audioPath: string, callback:Function) {
        let audioKey = bundleName + '/' + audioPath;
        const audioSource = AudioManager.audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        let cachedAudioClip = AudioManager.cachedAudioClipMap[audioKey];
        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, 1);
            const duration = cachedAudioClip.getDuration();
            callback(audioKey, duration);
        } else {
            const bundle = BundleManager.instance().getBundle(bundleName);
            bundle.load(audioPath, AudioClip, (err, clip) => {
                if (err) {
                    console.error(err);
                    return;
                }
                AudioManager.cachedAudioClipMap[key] = clip;
                audioSource.playOneShot(clip, 1);
                const duration = clip.getDuration();
                callback(key, duration);
            });
        }
    }
}