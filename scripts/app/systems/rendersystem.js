define(["app/ecs/system", "lib/easeljs"], function(System) {
    "use strict";

    var RenderSystem = System.extend({
        init: function(canvas, onTick, fps) {
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
            this.stage.update();
        }
    });

    return RenderSystem;
});