define(["app/ecs/component"], function(Component) {
    "use strict";

    var Direction = Component.extend({
        name: "direction",
        init: function(x, y) {
            this.x = x;
            this.y = y;
        },
        length: function() {
            return Math.sqrt(this.x, this.y);
        },
        normalise: function() {
            var length = this.length();
            if (length > 0) {
                this.x /= length;
                this.y /= length;
            }
        }
    });

    return Direction;
});