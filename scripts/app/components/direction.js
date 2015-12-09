define(["app/ecs/component"], function(Component) {
    "use strict";

    var Direction = Component.extend({
        name: "direction",
        init: function(x, y) {
            this.x = x;
            this.y = y;
        }
    });

    return Direction;
});