define(["app/input/keycodes"], function(keyCodes) {
    "use strict";

    const keys = new Array(255);

    var initialized = false;

    function init() {
        if (!initialized) {
            document.onkeydown = _onKeyPressed;
            document.onkeyup = _onKeyReleased;

            initialized = true;
        }
    }

    function isPressed(key) {
        var keyCode = keyCodes[key];
        return keys[keyCode] == true;
    };

    function isReleased(key) {
        var keyCode = keyCodes[key];
        return keys[keyCode] == false;
    };

    function _onKeyPressed(event) {
        keys[event.keyCode] = true;
    };

    function _onKeyReleased(event) {
        keys[event.keyCode] = false
    };

    return {
        init: init,
        isPressed: isPressed,
        isReleased: isReleased
    };
});