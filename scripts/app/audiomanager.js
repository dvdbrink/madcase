define(["lib/soundjs", "app/util"], function(_, util) {
    var _masterVolume;
    var _assetManager;

    var _playList = [];

    function AudioManager(masterVolume, assetManager) {
        _masterVolume = masterVolume;
        _assetManager = assetManager;
    }

    AudioManager.prototype.playEffect = function(soundId) {
        if (_assetManager.get(soundId)) {
            var sound = createjs.Sound.play(soundId);
            sound.volume = _masterVolume;
        }
    };

    AudioManager.prototype.playList = function(list, repeat, shuffle) {
        if (shuffle) {
            list = util.shuffleArray(list);
        }
        list.forEach(_addTrack);

        _playTrack(0, repeat);
    };

    function _addTrack(track) {
        _playList.push(track);
    }

    function _playTrack(index, repeat) {
        if (index > _playList.length-1) {
            if (repeat) index = 0;
            else return;
        }

        var soundId = _playList[index];
        if (_assetManager.get(soundId)) {
            var sound = createjs.Sound.play(soundId);
            sound.volume = _masterVolume;
            sound.on("complete", function() {
                _playTrack(index+1, repeat);
            }, this);
        }
        else {
            _playTrack(index+1, repeat);
        }
    }

    return AudioManager;
});