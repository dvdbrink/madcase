define(["app/ecs/component"], function(Component) {
    "use strict";

    var Shape = Component.extend({
        name: "shape",
        init: function(shape) {
            this.shape = shape;
        }
    });

    return Shape;
});