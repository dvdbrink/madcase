define(["app/ecs/system"], function(System) {
    "use strict";

    var DeathSystem = System.extend({
        init: function(entityCreator) {
            this.entityCreator = entityCreator;
        },
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