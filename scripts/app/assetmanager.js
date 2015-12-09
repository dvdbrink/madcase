define(["lib/preloadjs", "app/tiledloader"], function(_, TiledLoader) {
    var loader;

    function AssetManager(manifest, onComplete) {
        loader = new createjs.LoadQueue();
        loader.installPlugin(TiledLoader);
        loader.on("complete", onComplete);
        loader.loadManifest({src: manifest, type: "manifest"});
    }

    AssetManager.prototype.get = function(id) {
        return loader.getResult(id);
    };

    return AssetManager;
});