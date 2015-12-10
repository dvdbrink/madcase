define(["lib/soundjs"], function(_) {
    function AudioManager(assetManager) {
        this.assetManager = assetManager;
    }

    AudioManager.prototype.play = function(soundId) {
        if (this.assetManager.get(soundId)) {
            createjs.Sound.play(soundId);
        }
    };

    return AudioManager;
});