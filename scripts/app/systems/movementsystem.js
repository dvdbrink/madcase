define(["app/ecs/system"], function(System) {
    "use strict";

    var MovementSystem = System.extend({
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["position", "velocity"])) {
                var position = entity.getComponent("position");
                var velocity = entity.getComponent("velocity");

                position.x += velocity.x * dt;
                position.y += velocity.y * dt;

                if (entity.hasComponent("sprite")) {
                    var sprite = entity.getComponent("sprite");
                    sprite.sprite.x = position.x;
                    sprite.sprite.y = position.y;
                }

                if (entity.hasComponent("shape")) {
                    var shape = entity.getComponent("shape");
                    shape.shape.x += velocity.x * dt;
                    shape.shape.y += velocity.y * dt;
                }

                if (entity.hasComponent("collision")) {
                    var collision = entity.getComponent("collision");
                    collision.x = position.x;
                    collision.y = position.y;
                }
            }
        }
    });

    return MovementSystem;
});