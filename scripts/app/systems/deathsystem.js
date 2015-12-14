define(["app/ecs/system"], function(System) {
    "use strict";

    var DeathSystem = System.extend({
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["health"])) {
                var health = entity.getComponent("health");

                if (health.onChange) {
                    health.onChange(entity);
                }
            }
        }
    });

    return DeathSystem;
});