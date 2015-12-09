define([
    "app/assetmanager",
    "app/ecs/world",
    "app/ecs/entity",
    "app/entitycreator",
    "app/systems/animationsystem",
    "app/systems/collisionsystem",
    "app/systems/deathsystem",
    "app/systems/deterioratesystem",
    "app/systems/inputsystem",
    "app/systems/movementsystem",
    "app/systems/rendersystem"
], function(AssetManager, World, Entity, EntityCreator, AnimationSystem, CollisionSystem, DeathSystem,
            DeteriorateSystem, InputSystem, MovementSystem, RenderSystem) {
    "use strict";

    const FPS = 60;
    const PLAYER_COLLISIONS = true;
    const MANIFEST = "assets/configs/manifest.json";

    var canvas, width, height;

    var assetManager;
    var world;
    var entityCreator;

    function Game(canvasElement) {
        canvas = canvasElement;
        width = canvasElement.width;
        height = canvasElement.height;

        this.resize();
    }

    Game.prototype.start = function() {
        assetManager = new AssetManager(MANIFEST, function() {
            loadWorld();
            loadMap();
            loadPlayers();
        });
    };

    Game.prototype.resize = function() {
        var gameWidth = window.innerWidth;
        var gameHeight = window.innerHeight;
        var scaleToFitX = gameWidth / width;
        var scaleToFitY = gameHeight / height;

        var currentScreenRatio = gameWidth / gameHeight;
        var optimalRatio = Math.min(scaleToFitX, scaleToFitY);

        if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
            canvas.style.width = gameWidth + "px";
            canvas.style.height = gameHeight + "px";
        }
        else {
            canvas.style.width = width * optimalRatio + "px";
            canvas.style.height = height * optimalRatio + "px";
        }
    }

    function loadWorld() {
        world = new World();
        entityCreator = new EntityCreator(world);

        // Order is important!
        world.addSystem(new DeteriorateSystem());
        world.addSystem(new DeathSystem(entityCreator));
        world.addSystem(new InputSystem(entityCreator));
        world.addSystem(new MovementSystem());
        world.addSystem(new CollisionSystem(entityCreator, PLAYER_COLLISIONS));
        world.addSystem(new AnimationSystem());
        world.addSystem(new RenderSystem(canvas, FPS, tick));
    }

    function loadMap() {
        var map = assetManager.get("level");
        for (var layer of map.layers) {
            for (var x = 0; x < layer.length; ++x) {
                for (var y = 0; y < layer[x].length; ++y) {
                    var tile = layer[x][y];
                    if (tile) {
                        entityCreator.createTile(tile);
                    }
                }
            }
        }
    }

    function loadPlayers() {
        var controls = assetManager.get("controls");
        loadPlayer("Player 1", "link", 0, 0, 0.0075, controls.keyBindings[0]);
        loadPlayer("Player 2", "alien", 100, 100, 0.0075, controls.keyBindings[1]);
    }

    function loadPlayer(name, assetId, posX, posY, speed, keyBindings) {
        var spriteSheet = assetManager.get(assetId);
        entityCreator.createPlayer(name, posX, posY, speed, spriteSheet, keyBindings);
    }

    function tick(event) {
        world.update(event.delta);
    }

    return Game;
});