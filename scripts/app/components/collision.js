define(["app/ecs/component"], function(Component) {
    "use strict";

    var Collision = Component.extend({
        name: "collision",
        init: function(x, y, width, height, onCollision) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.onCollision = onCollision;
        }
    });

    return Collision;
});