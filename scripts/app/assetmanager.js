define(["lib/preloadjs", "lib/soundjs", "app/tiledloader"], function(_, __, TiledLoader) {
    var loader;

    function AssetManager(manifest) {
        this.manifest = manifest;

        loader = new createjs.LoadQueue();
        loader.installPlugin(createjs.Sound);
        loader.installPlugin(TiledLoader);
    }

    AssetManager.prototype.load = function(onProgress, onComplete) {
        loader.on("progress", function(event) {
            var progress = event.progress;
            onProgress(progress);
        });
        loader.on("complete", onComplete);
        loader.loadManifest({src: this.manifest, type: "manifest"});
    };

    AssetManager.prototype.get = function(id) {
        return loader.getResult(id);
    };

    return AssetManager;
});