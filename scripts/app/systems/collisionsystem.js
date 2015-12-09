define(["app/ecs/system"], function(System) {
    "use strict";

    var CollisionSystem = System.extend({
        init: function(entityCreator, playerCollisions) {
            this.entityCreator = entityCreator;
            this.playerCollisions = playerCollisions;
        },
        update: function(entityManager, dt) {
            for (var e1 of entityManager.withComponents(["position", "velocity", "collision"])) {
                for (var e2 of entityManager.withComponents(["collision"])) {
                    if (this.collide(e1, e2)) {
                        var c1 = e1.getComponent("collision");
                        if (c1.onCollision) {
                            c1.onCollision(this.entityCreator, e1, e2);
                        }
                    }
                }
            }
        },
        collide: function (e1, e2) {
            // Don't test entities' collision with itself
            if (e1.id == e2.id) {
                return false;
            }

            // Skip collision test if both entities are player controlled and player collisions are enabled
            if (!this.playerCollisions) {
                if (e1.hasComponent("playercontroller") && e2.hasComponent("playercontroller")) {
                    return false;
                }
            }

            var c1 = e1.getComponent("collision");
            var c2 = e2.getComponent("collision");
            if (this.intersect(c1, c2)) {
                return true;
            }

            return false;
        },
        intersect: function(c1, c2) {
            return (c1.x < c2.x + c2.width && c1.x + c1.width > c2.x &&
                    c1.y < c2.y + c2.height && c1.y + c1.height > c2.y);
        }
    });

    return CollisionSystem;
});