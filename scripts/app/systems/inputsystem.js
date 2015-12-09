define(["app/ecs/system", "app/keyboard"], function(System, Keyboard) {
    "use strict";

    var InputSystem = System.extend({
        init: function(keyCodes, entityCreator) {
            Keyboard.init(keyCodes);

            this.entityCreator = entityCreator;
        },
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["playercontroller", "position", "velocity", "direction"])) {
                this.processInput(entity);
                this.processActions(entity, dt);
            }
        },
        processInput: function(entity) {
            var pc = entity.getComponent("playercontroller");
            for (var action in pc.actions) {
                var boundKeys = pc.keyBindings[action];
                var active = this.isActionActive(pc.actions[action], boundKeys);
                pc.actions[action].active = active;
            }
        },
        isActionActive: function(action, boundKeys) {
            for (var i in boundKeys) {
                var key = boundKeys[i];
                if (Keyboard.isPressed(key) && !this.isActionDelayed(action)) {
                    this.setActionDelayed(action);
                    return true;
                }
            }
            return false;
        },
        isActionDelayed: function(action) {
            if (action.delay > 0 && action.ticked) {
                if (Date.now() >= action.ticked + action.delay) {
                    return false;
                }
                return true;
            }
            return false;
        },
        setActionDelayed: function(action) {
            if (action.delay > 0) {
                action.ticked = Date.now();
            }
        },
        processActions: function(entity, dt) {
            var pc = entity.getComponent("playercontroller");
            var position = entity.getComponent("position");
            var velocity = entity.getComponent("velocity");
            var direction = entity.getComponent("direction");

            velocity.x = 0;
            velocity.y = 0;

            if (pc.actions["moveup"].active) {
                velocity.y -= velocity.speed * dt;
            }
            if (pc.actions["moveleft"].active) {
                velocity.x -= velocity.speed * dt;
            }
            if (pc.actions["movedown"].active) {
                velocity.y += velocity.speed * dt;
            }
            if (pc.actions["moveright"].active) {
                velocity.x += velocity.speed * dt;
            }

            if (velocity.x != 0 || velocity.y != 0) {
                var direction = entity.getComponent("direction");
                direction.x = velocity.x;
                direction.y = velocity.y;
                direction.normalise();
            }

            if (pc.actions["shoot"].active) {
                this.entityCreator.createBullet(
                    position.x + direction.x * 100, position.y + direction.y * 100,
                    direction.x, direction.y, 0,
                    "black", 5);
            }
        }
    });

    return InputSystem;
});