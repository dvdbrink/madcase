define([
    "app/ecs/entity",
    "app/components/collision",
    "app/components/damage",
    "app/components/deteriorate",
    "app/components/direction",
    "app/components/health",
    "app/components/playercontroller",
    "app/components/position",
    "app/components/shape",
    "app/components/sprite",
    "app/components/velocity"
], function(Entity, Collision, Damage, Deteriorate, Direction, Health,
            PlayerController, Position, Shape, Sprite, Velocity) {
    "use strict";

    function EntityCreator(world, audioManager, uiManager) {
        this.world = world;
        this.audioManager = audioManager;
        this.uiManager = uiManager;
    }

    EntityCreator.prototype.destroy = function(entity) {
        this.world.removeEntity(entity);
    };

    EntityCreator.prototype.createLevel = function(level, cache) {
        var container = new createjs.Container();
        for (var layer of level.layers) {
            for (var x = 0; x < layer.length; ++x) {
                for (var y = 0; y < layer[x].length; ++y) {
                    var tile = layer[x][y];
                    if (tile) {
                        container.addChild(tile);
                    }
                }
            }
        }

        if (cache) {
            var bounds = container.getBounds();
            container.cache(container.x, container.y, bounds.width, bounds.height);
        }

        var e = new Entity();
        e.addComponent(new Sprite(container));
        this.world.addEntity(e);
    };

    EntityCreator.prototype.createPlayer = function(spriteSheet, name, position, healthBarPosition, keyBindings) {
        var that = this;

        const acceleration = 0.0075;

        var sprite = new createjs.Sprite(spriteSheet);
        var bounds = sprite.getBounds();
        var regX = spriteSheet._regX;
        var regY = spriteSheet._regY;

        var e = new Entity();
        e.addComponent(new Position(position.x, position.y));
        e.addComponent(new Velocity(0, 0, acceleration));
        e.addComponent(new Sprite(sprite));
        e.addComponent(new PlayerController(name, keyBindings));
        e.addComponent(new Health(100, function(entity) {
            var health = entity.getComponent("health");
            if (health.value <= 0) {
                that.audioManager.play("death");
                that.destroy(entity);
            }

            that.uiManager.updateHealthBar(name, health.value);
        }));
        e.addComponent(new Direction(-1, 0));
        e.addComponent(new Collision(
            bounds.x + position.x + regX,
            bounds.y + position.y + regY,
            bounds.width - regX * 2,
            bounds.height - regY * 2
        ));
        this.world.addEntity(e);

        that.uiManager.createHealthBar(name, healthBarPosition.x, healthBarPosition.y);
    };

    EntityCreator.prototype.createBullet = function(origin, direction) {
        var that = this;

        const color = "darkblue";
        const radius = 5;
        const margin = {
            x: 30,
            y: 50
        };

        var posX = origin.x + (direction.x * margin.x);
        var posY = origin.y + (direction.y * margin.y);
        var velX = direction.x;
        var velY = direction.y;

        var shape = new createjs.Shape();
        shape.graphics
            .beginFill(color)
            .drawCircle(posX + radius, posY + radius, radius);

        var e = new Entity();
        e.addComponent(new Position(posX, posY));
        e.addComponent(new Velocity(velX, velY, 0));
        e.addComponent(new Shape(shape));
        e.addComponent(new Damage(20));
        e.addComponent(new Health(20, function(entity) {
            var health = entity.getComponent("health")
            if (health.value <= 0) {
                that.destroy(entity);
            }
        }));
        e.addComponent(new Deteriorate(1));
        e.addComponent(new Collision(posX, posY, radius * 2, radius * 2, function(bullet, other) {
            if (other.hasComponent("health")) {
                var damage = bullet.getComponent("damage");
                var health = other.getComponent("health");
                health.value -= damage.value;
            }

            that.audioManager.play("hit");
            that.destroy(bullet);
        }));
        this.world.addEntity(e);

        this.audioManager.play("shoot");
    };

    return EntityCreator;
});