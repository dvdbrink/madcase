define(["app/ecs/component"], function(Component) {
    "use strict";

    var Sprite = Component.extend({
        name: "sprite",
        init: function(sprite) {
            this.sprite = sprite;
            this.currentAnimation = undefined;
        }
    });

    return Sprite;
});