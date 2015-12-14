define(["lib/easeljs"], function() {
    var stage;
    var dirty;

    var loadingBar = null;
    var healthBars = {};

    function UIManager(canvas) {
        stage = new createjs.Stage(canvas);

        createjs.Ticker.addEventListener("tick", function () {
            if (dirty) {
                stage.update();
                dirty = false;
            }
        });
    }

    UIManager.prototype.createLoadingBar = function() {
        loadingBar = createProgressBar(canvas.width / 2 - 100, canvas.height / 2 - 15, 200, 30, 2, "black", "black", "white", 1);
        stage.addChild(loadingBar);
        dirty = true;
    };

    UIManager.prototype.updateLoadingBar = function(percentage) {
        if (loadingBar) {
            var progressBar = loadingBar.getChildAt(2);
            progressBar.scaleX = percentage * 100;
            dirty = true;
        }
    };

    UIManager.prototype.destroyLoadingBar = function() {
        if (loadingBar) {
            stage.removeChild(loadingBar);
            loadingBar = null;
            dirty = true;
        }
    };

    UIManager.prototype.createHealthBar = function(id, x, y) {
        var healthBar = createProgressBar(x, y, 100, 15, 2, "black", "grey", "red", 100);
        healthBars[id] = healthBar;
        stage.addChild(healthBar);
        dirty = true;
    };

    UIManager.prototype.updateHealthBar = function(id, health) {
        if (healthBars[id]) {
            var healthBar = healthBars[id];
            var progressBar = healthBar.getChildAt(2);
            progressBar.scaleX = health / 100;
            dirty = true;
        }
    };

    UIManager.prototype.destroyHealthBar = function(id) {
        if (healthBars[id]) {
            var healthBar = healthBars[id];
            stage.removeChild(healthBar);
            delete healthBars[id];
            dirty = true;
        }
    };

    function createProgressBar(x, y, width, height, padding, frameColor, backgroundColor, barColor, initialScale) {
        var frame = new createjs.Shape();
        frame.graphics.beginFill(frameColor).drawRect(-padding/2, -padding/2, width+padding, height+padding);

        var back = new createjs.Shape();
        back.graphics.beginFill(backgroundColor).drawRect(0, 0, width, height);

        var bar = new createjs.Shape();
        bar.graphics.beginFill(barColor).drawRect(0, 0, initialScale, height).endFill();

        var container = new createjs.Container();
        container.x = x;
        container.y = y;
        container.addChildAt(frame, 0);
        container.addChildAt(back, 1);
        container.addChildAt(bar, 2);

        return container;
    }

    return UIManager;
});