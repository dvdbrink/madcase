define(["app/ecs/component"], function(Component) {
    "use strict";

    var Health = Component.extend({
        name: "health",
        init: function(value) {
            this.value = value;
        }
    });

    return Health;
});