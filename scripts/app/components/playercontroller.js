define(["app/ecs/component"], function(Component) {
    "use strict";

    var PlayerController = Component.extend({
        name: "playercontroller",
        init: function (playerName, keyBindings) {
            this.actions = {
                "moveup": {
                    "delay": 0
                },
                "moveleft": {
                    "delay": 0
                },
                "movedown": {
                    "delay": 0
                },
                "moveright": {
                    "delay": 0
                },
                "shoot": {
                    "delay": 500
                }
            };
            this.playerName = playerName;
            this.keyBindings = keyBindings;
        }
    });

    return PlayerController;
});