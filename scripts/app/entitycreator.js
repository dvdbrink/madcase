define([
    "app/ecs/entity",
    "app/components/collision",
    "app/components/deteriorate",
    "app/components/direction",
    "app/components/health",
    "app/components/playercontroller",
    "app/components/position",
    "app/components/shape",
    "app/components/sprite",
    "app/components/velocity"
], function(Entity, Collision, Deteriorate, Direction, Health, PlayerController, Position, Shape, Sprite, Velocity) {
    "use strict";

    function EntityCreator(world, audioManager) {
        this.world = world;
        this.audioManager = audioManager;
    }

    EntityCreator.prototype.destroy = function(entity) {
        this.world.removeEntity(entity);
    };

    EntityCreator.prototype.createPlayer = function(name, posX, posY, speed, spriteSheet, keyBindings) {
        var sprite = new createjs.Sprite(spriteSheet);
        var bounds = sprite.getBounds();
        var regX = spriteSheet._regX;
        var regY = spriteSheet._regY;

        var e = new Entity();
        e.addComponent(new Position(posX, posY));
        e.addComponent(new Velocity(0, 0, speed));
        e.addComponent(new Sprite(sprite));
        e.addComponent(new PlayerController(name, keyBindings));
        e.addComponent(new Health(100));
        e.addComponent(new Direction(1, 0));
        e.addComponent(new Collision(
            bounds.x + posX + regX,
            bounds.y + posY + regY,
            bounds.width - regX * 2,
            bounds.height - regY * 2
        ));

        this.world.addEntity(e);
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

    EntityCreator.prototype.createBullet = function(posX, posY, velX, velY, speed, color, radius) {
        var that = this;

        var shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawCircle(posX + radius, posY + radius, radius);

        var e = new Entity();
        e.addComponent(new Position(posX, posY));
        e.addComponent(new Velocity(velX, velY, speed));
        e.addComponent(new Shape(shape));
        e.addComponent(new Health(20));
        e.addComponent(new Deteriorate(1));
        e.addComponent(new Collision(posX, posY, radius * 2, radius * 2, function(bullet, other) {
            if (other.hasComponent("health")) {
                var health = other.getComponent("health");
                health.value -= 20;
            }

            that.audioManager.play("hit");
            that.destroy(bullet);
        }));
        this.world.addEntity(e);

        this.audioManager.play("shoot");
    };

    return EntityCreator;
});