define(["app/ecs/component"], function(Component) {
    "use strict";

    var Position = Component.extend({
        name: "position",
        init: function(x, y) {
            this.x = x;
            this.y = y;
        }
    });

    return Position;
});