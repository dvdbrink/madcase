define(["app/ecs/system"], function(System) {
    "use strict";

    var DeteriorateSystem = System.extend({
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["deteriorate", "health"])) {
                var deteriorate = entity.getComponent("deteriorate");
                var health = entity.getComponent("health");

                health.value -= deteriorate.value;
            }
        }
    });

    return DeteriorateSystem;
});