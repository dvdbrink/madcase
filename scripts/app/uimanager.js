define(["lib/easeljs"], function() {
    var stage;
    var dirty;
    var progressBars = {};

    function UIManager(canvas) {
        stage = new createjs.Stage(canvas);
    }

    UIManager.prototype.update = function(dt) {
        if (dirty) {
            stage.update();
            dirty = false;
        }
    };

    UIManager.prototype.createHealthBar = function(id, x, y) {
        createProgressBar(id, x, y, 100, 15, 2, "black", "grey", "red");
    };

    UIManager.prototype.updateHealthBar = function(id, health) {
        if (progressBars[id]) {
            var bar = progressBars[id];
            bar.scaleX = health / 100;

            dirty = true;
        }
    };

    function createProgressBar(id, x, y, width, height, padding, frameColor, backgroundColor, barColor) {
        var frame = new createjs.Shape();
        frame.graphics.beginFill(frameColor).drawRect(0, 0, width+padding, height+padding);

        var back = new createjs.Shape();
        back.graphics.beginFill(backgroundColor).drawRect(padding/2, padding/2, width, height);

        var bar = new createjs.Shape();
        bar.graphics.beginFill(barColor).drawRect(padding/2, padding/2, width, height).endFill();

        var container = new createjs.Container();
        container.x = x;
        container.y = y;
        container.addChild(frame, back, bar);
        stage.addChild(container);

        progressBars[id] = bar;
        dirty = true;
    }

    return UIManager;
});