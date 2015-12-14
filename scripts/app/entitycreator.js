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

    function EntityCreator(world, assetManager, audioManager, uiManager) {
        this.world = world;
        this.assetManager = assetManager;
        this.audioManager = audioManager;
        this.uiManager = uiManager;
    }

    EntityCreator.prototype.createFromManifest = function(manifest) {
        var entities = this.assetManager.get(manifest);
        for (var entity of entities.entities) {
            switch (entity.type) {
                case "level":
                    this.loadLevel(entity.assetId);
                    break;
                case "player":
                    this.loadPlayer(entity.assetId, entity.name, entity.position, entity.healthBarPosition, entity.keyBindings);
                    break;
            }
        }
    };

    EntityCreator.prototype.destroy = function(entity) {
        this.world.removeEntity(entity);
    };

    EntityCreator.prototype.createLevel = function(level) {
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

        var bounds = container.getBounds();
        container.cache(container.x, container.y, bounds.width, bounds.height);

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
                that.audioManager.playEffect("death");
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

            that.audioManager.playEffect("hit");
            that.destroy(bullet);
        }));
        this.world.addEntity(e);

        this.audioManager.playEffect("shoot");
    };

    EntityCreator.prototype.loadLevel = function(assetId) {
        var level = this.assetManager.get(assetId);
        this.createLevel(level);
    };

    EntityCreator.prototype.loadPlayer = function(assetId, name, position, healthBarPosition, keyBindingId) {
        var spriteSheet = this.assetManager.get(assetId);
        var controls = this.assetManager.get("controls");
        var keyBindings = controls.keyBindings[keyBindingId];
        this.createPlayer(spriteSheet, name, position, healthBarPosition, keyBindings);
    };

    return EntityCreator;
});