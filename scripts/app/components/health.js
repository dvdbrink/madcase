define(["app/ecs/component"], function(Component) {
    "use strict";

    var Health = Component.extend({
        name: "health",
        init: function(value, onDeath) {
            this.value = value;
            this.onDeath = onDeath;
        }
    });

    return Health;
});