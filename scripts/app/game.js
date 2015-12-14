define([
    "app/assetmanager",
    "app/audiomanager",
    "app/entitycreator",
    "app/uimanager",
    "app/ecs/world",
    "app/systems/animationsystem",
    "app/systems/collisionsystem",
    "app/systems/deathsystem",
    "app/systems/deterioratesystem",
    "app/systems/inputsystem",
    "app/systems/movementsystem",
    "app/systems/rendersystem"
], function(AssetManager, AudioManager, EntityCreator, UIManager, World,
            AnimationSystem, CollisionSystem, DeathSystem, DeteriorateSystem,
            InputSystem, MovementSystem, RenderSystem) {
    "use strict";

    const ASSET_MANIFEST = "assets/configs/manifest.json";
    const PLAYER_COLLISIONS = false;
    const TARGET_FPS = 60;
    const MASTER_VOLUME = 0.3;

    var canvas,
        overlayCanvas,
        width,
        height;

    var world,
        assetManager,
        audioManager,
        entityCreator,
        uiManager;

    function Game(canvasElement, overlayCanvasElement) {
        canvas = canvasElement;
        overlayCanvas = overlayCanvasElement;
        width = canvasElement.width;
        height = canvasElement.height;

        // Keep aspect ratio and in-game resolution on browser resize
        window.addEventListener("resize", resize, false);
        // Make sure the canvas is initially correct
        resize();
    }

    Game.prototype.start = function() {
        world = new World();
        assetManager = new AssetManager(ASSET_MANIFEST);
        audioManager = new AudioManager(assetManager, MASTER_VOLUME);
        uiManager = new UIManager(overlayCanvas);
        entityCreator = new EntityCreator(world, assetManager, audioManager, uiManager);

        uiManager.createLoadingBar();
        assetManager.load(uiManager.updateLoadingBar, function() {
            // Order is important!
            world.addSystem(new DeteriorateSystem());
            world.addSystem(new DeathSystem());
            world.addSystem(new InputSystem(entityCreator));
            world.addSystem(new MovementSystem());
            world.addSystem(new CollisionSystem(PLAYER_COLLISIONS));
            world.addSystem(new AnimationSystem());
            world.addSystem(new RenderSystem(canvas, function(event) {
                world.update(event.delta);
            }, TARGET_FPS));

            entityCreator.createFromManifest("entities");
            uiManager.destroyLoadingBar();
        });
    };

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

        overlayCanvas.style.width = canvas.style.width;
        overlayCanvas.style.height = canvas.style.height;
    }

    return Game;
});