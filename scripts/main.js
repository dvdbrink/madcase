// PreloadJS currently doesn't support AMD/CommonJS. This is a workaround.
// For more information see https://github.com/CreateJS/PreloadJS/issues/85
if (typeof window === "undefined") {
    this.createjs = this.createjs || {};
}
else {
    window.createjs = window.createjs || {};
}

requirejs.config({
    baseUrl: "scripts",
    paths: {
        "lib/easeljs": "lib/easeljs-0.8.2.min",
        "lib/preloadjs": "lib/preloadjs-0.6.1.min",
        "lib/soundjs": "lib/soundjs-0.6.1.min"
    }
});

requirejs(["app/game"], function(Game) {
    var canvas = document.getElementById("canvas");
    var game = new Game(canvas);

    window.addEventListener("resize", game.resize, false);

    game.start();
});