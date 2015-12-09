define(["app/ecs/entitymanager"], function(EntityManager) {
    "use strict";

    function World() {
        this.entityManager = new EntityManager();
        this.systems = [];
    }

    World.prototype.addEntity = function(entity) {
        this.entityManager.add(entity);

        for (var system of this.systems) {
            system.onEntityAdded(entity);
        }
    };

    World.prototype.removeEntity = function(entity) {
        this.entityManager.remove(entity);

        for (var system of this.systems) {
            system.onEntityRemoved(entity);
        }
    };

    World.prototype.addSystem = function(system) {
        this.systems.push(system);
    };

    World.prototype.update = function(dt) {
        for (var system of this.systems) {
            system.update(this.entityManager, dt);
        }
    };

    return World;
});