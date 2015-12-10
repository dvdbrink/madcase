define(["app/ecs/component"], function(Component) {
    "use strict";

    var Health = Component.extend({
        name: "health",
        init: function(value, onChange) {
            this.value = value;
            this.onChange = onChange;
        }
    });

    return Health;
});