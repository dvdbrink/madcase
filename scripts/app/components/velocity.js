define(["app/ecs/component"], function(Component) {
    "use strict";

    var Velocity = Component.extend({
        name: "velocity",
        init: function(x, y, speed) {
            this.x = x;
            this.y = y;
            this.speed = speed;
        }
    });

    return Velocity;
});