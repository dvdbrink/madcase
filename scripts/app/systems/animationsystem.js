define(["app/ecs/system"], function(System) {
    "use strict";

    var AnimationSystem = System.extend({
        update: function(entityManager, dt) {
            for (var entity of entityManager.withComponents(["position", "velocity", "sprite"])) {
                var position = entity.getComponent("position");
                var velocity = entity.getComponent("velocity");
                var sprite = entity.getComponent("sprite");

                this.updateAnimation(sprite, velocity.y < 0, "up");
                this.updateAnimation(sprite, velocity.x < 0, "left");
                this.updateAnimation(sprite, velocity.y > 0, "down");
                this.updateAnimation(sprite, velocity.x > 0, "right");
            }
        },
        updateAnimation: function(sprite, isDirection, animation) {
            if (isDirection && sprite.currentAnimation == undefined) {
                sprite.sprite.gotoAndPlay(animation);
                sprite.currentAnimation = animation;
            }
            else if (!isDirection && sprite.currentAnimation == animation) {
                sprite.sprite.gotoAndStop(animation);
                sprite.currentAnimation = undefined;
            }
        }
    });

    return AnimationSystem;
});