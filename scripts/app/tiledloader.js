define(["lib/preloadjs"], function() {
    "use strict";

    function Map(mapData) {
        this.mapData = null;
        this.tilesets = [];
    }

    function TiledLoader(item) {
        this.AbstractLoader_constructor(item, false, "loader");
        this.map = new Map();
    }

    // Static Plugin Methods
    TiledLoader.getPreloadHandlers = function() {
        return {
            types: ["tiled"],
            callback: TiledLoader.preloadHandler
        };
    };
    TiledLoader.preloadHandler = function(loadItem) {
        return new TiledLoader(loadItem);
    };

    // Loader Methods
    var p = createjs.extend(TiledLoader, createjs.AbstractLoader);
    p.load = function() {
        this.loadMapData();
    };
    p.loadMapData = function() {
        var jsonLoader = new createjs.JSONLoader(this._item);
        jsonLoader.on("complete", createjs.proxy(this.loadTileSets, this));
        jsonLoader.load();
    },
    p.loadTileSets = function(event) {
        this.map.mapData = event.result;

        var images = [];
        for (var tileset of this.map.mapData.tilesets) {
            images.push({
                "id": tileset.name,
                "src": tileset.image,
                "width": tileset.tilewidth,
                "height": tileset.tileheight
            });
        }

        var tilesetLoader = new createjs.LoadQueue();
        tilesetLoader.on("fileload", createjs.proxy(this.loadTileSet, this));
        tilesetLoader.on("complete", createjs.proxy(this.loadLayers, this));
        tilesetLoader.loadManifest(images);
    },
    p.loadTileSet = function(event) {
        this.map.tilesets.push(event.result);
    },
    p.loadLayers = function() {
        this.map.spriteSheet = new createjs.SpriteSheet({
            images: this.map.tilesets,
            frames: {
                width: 32,
                height: 32
            }
        });

        this.map.layers = [];
        for (var layer of this.map.mapData.layers) {
            if (layer.type == "tilelayer") {
                this.map.layers.push(this.loadLayer(layer));
            }
        }

        this.loadComplete();
    },
    p.loadLayer = function(layer) {
        var data = new Array(10);
        for (var x = 0; x < layer.width; ++x) {
            data[x] = new Array(10);
            for (var y = 0; y < layer.height; ++y) {
                var sprite = null;

                var tileId = layer.data[x + y * layer.width] - 1;
                if (tileId > 0) {
                    sprite = new createjs.Sprite(this.map.spriteSheet);

                    sprite.x = x * 32;
                    sprite.y = y * 32;

                    sprite.gotoAndStop(tileId);
                }

                data[x][y] = sprite;
            }
        }
        return data;
    },
    p.loadComplete = function(event) {
        this._result = this.map;
        this._sendComplete();
    };

    return createjs.promote(TiledLoader, "AbstractLoader");
});