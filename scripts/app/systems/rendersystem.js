define(["app/ecs/system", "lib/easeljs"], function(System) {
    "use strict";

    var RenderSystem = System.extend({
        temp: [],
        init: function(canvas, fps, onTick, debug) {
            this.debug = debug;

            this.stage = new createjs.Stage(canvas);

            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", onTick);
            createjs.Ticker.setFPS(fps);
        },
        onEntityAdded: function(entity) {
            if (entity.hasComponent("sprite")) {
                var sprite = entity.getComponent("sprite");
                this.stage.addChild(sprite.sprite);
            }
            if (entity.hasComponent("shape")) {
                var shape = entity.getComponent("shape");
                this.stage.addChild(shape.shape);
            }
        },
        onEntityRemoved: function(entity) {
            if (entity.hasComponent("sprite")) {
                var sprite = entity.getComponent("sprite");
                this.stage.removeChild(sprite.sprite);
            }
            if (entity.hasComponent("shape")) {
                var shape = entity.getComponent("shape");
                this.stage.removeChild(shape.shape);
            }
        },
        update: function(entityManager, dt) {
            if (this.debug) {
                for (var entity of entityManager.withComponents(["collision"])) {
                    var c = entity.getComponent("collision");

                    var rect = new createjs.Shape();
                    rect.graphics.beginStroke("red").drawRect(c.x, c.y, c.width, c.height);

                    this.temp.push(rect);
                    this.stage.addChild(rect);
                }
            }

            this.stage.update();

            if (this.debug) {
                for (var i of this.temp) {
                    this.stage.removeChild(i);
                }
            }
        }
    });

    return RenderSystem;
});