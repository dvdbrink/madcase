define([
    "app/assetmanager",
    "app/audiomanager",
    "app/entitycreator",
    "app/ecs/world",
    "app/ecs/entity",
    "app/systems/animationsystem",
    "app/systems/collisionsystem",
    "app/systems/deathsystem",
    "app/systems/deterioratesystem",
    "app/systems/inputsystem",
    "app/systems/movementsystem",
    "app/systems/rendersystem"
], function(AssetManager, AudioManager, EntityCreator, World, Entity,
            AnimationSystem, CollisionSystem, DeathSystem, DeteriorateSystem,
            InputSystem, MovementSystem, RenderSystem) {
    "use strict";

    const MANIFEST = "assets/configs/manifest.json";
    const PLAYER_COLLISIONS_ENABLED = true;
    const TARGET_FPS = 60;
    const CACHE_LEVEL = true;

    var canvas,
        width,
        height;

    var world,
        assetManager,
        audioManager,
        entityCreator;

    function Game(canvasElement) {
        canvas = canvasElement;
        width = canvasElement.width;
        height = canvasElement.height;

        // Keep aspect ratio and in-game resolution on browser resize
        window.addEventListener("resize", resize, false);
        // Make sure the canvas is initially correct
        resize();
    }

    Game.prototype.start = function() {
        world = new World();
        assetManager = new AssetManager(MANIFEST);
        audioManager = new AudioManager(assetManager);
        entityCreator = new EntityCreator(world, audioManager);

        // Order is important!
        world.addSystem(new DeteriorateSystem());
        world.addSystem(new DeathSystem(entityCreator));
        world.addSystem(new InputSystem(entityCreator));
        world.addSystem(new MovementSystem());
        world.addSystem(new CollisionSystem(PLAYER_COLLISIONS_ENABLED));
        world.addSystem(new AnimationSystem());
        world.addSystem(new RenderSystem(canvas, tick, TARGET_FPS));

        assetManager.load(loadEntities);
    };

    function loadEntities() {
        var controls = assetManager.get("controls");
        var entities = assetManager.get("entities");

        for (var entity of entities.entities) {
            switch (entity.type) {
                case "level":
                    loadLevel(entity.assetId);
                    break;
                case "player":
                    var keyBindings = controls.keyBindings[entity.keyBindings];
                    loadPlayer(entity.assetId, entity.name, entity.position, keyBindings);
                    break;
            }
        }
    }

    function loadLevel(assetId) {
        var level = assetManager.get(assetId);
        entityCreator.createLevel(level, CACHE_LEVEL);
    }

    function loadPlayer(assetId, name, position, keyBindings) {
        var spriteSheet = assetManager.get(assetId);
        entityCreator.createPlayer(spriteSheet, name, position, keyBindings);
    }

    function tick(event) {
        world.update(event.delta);
    }

    function resize() {
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

    return Game;
});