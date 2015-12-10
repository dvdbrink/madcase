define(["app/ecs/system"], function(System) {
    "use strict";

    var DeathSystem = System.extend({
        init: function(entityCreator) {
            this.entityCreator = entityCreator;
        },
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["health"])) {
                var health = entity.getComponent("health");

                if (health.value <= 0 && health.onDeath) {
                    health.onDeath(entity);
                }
            }
        }
    });

    return DeathSystem;
});