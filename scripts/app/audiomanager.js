define(["lib/soundjs"], function(_) {
    function AudioManager(assetManager, masterVolume) {
        this.assetManager = assetManager;
        this.masterVolume = masterVolume;
    }

    AudioManager.prototype.play = function(soundId) {
        if (this.assetManager.get(soundId)) {
            var sound = createjs.Sound.play(soundId);
            sound.volume = this.masterVolume;
        }
    };

    return AudioManager;
});