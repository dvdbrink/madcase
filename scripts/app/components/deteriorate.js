define(["app/ecs/component"], function(Component) {
    "use strict";

    var Deteriorate = Component.extend({
        name: "deteriorate",
        init: function(value) {
            this.value = value;
        }
    });

    return Deteriorate;
});