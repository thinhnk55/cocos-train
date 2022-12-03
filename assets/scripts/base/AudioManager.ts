import { assert, assetManager, AudioClip, AudioSource, log } from "cc";

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

    public static playSound(path: string, callback:Function) {
        const audioSource = AudioManager.audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        let cachedAudioClip = AudioManager.cachedAudioClipMap[path];
        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, 1);
            const duration = cachedAudioClip.getDuration();
            callback(path, duration);
        } else {
            assetManager.resources?.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.error(err);
                    return;
                }
                AudioManager.cachedAudioClipMap[path] = clip;
                audioSource.playOneShot(clip, 1);
                const duration = clip.getDuration();
                callback(path, duration);
            });
        }
    }
}