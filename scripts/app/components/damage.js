define(["app/ecs/component"], function(Component) {
    "use strict";

    var Damage = Component.extend({
        name: "damage",
        init: function(value) {
            this.value = value;
        }
    });

    return Damage;
});