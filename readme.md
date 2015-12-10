## madcase

### Controls
* Player 1: WASD + Space
* Player 2: Arrow keys + Enter

### Play
[Click me](https://danielvandenbrink.com/madcase/)

### Roadmap
* Terrain collisions
* UI/HUD
* Win/lose

### Code organization
| Path/File                    | Description                                                                 |
| ---------------------------- |:---------------------------------------------------------------------------:|
| scripts/app/ecs              | Simple entity component system (ECS) implementation                         |
| scripts/app/components       | ECS components used by game                                                 |
| scripts/app/systems          | ECS systems used by game                                                    |
| scripts/app/input            | Keyboard input handling                                                     |
| scripts/app/assetmanager.js  | Loading and retrieving assets                                               |
| scripts/app/audiomanager.js  | Play sounds loaded by AssetManager                                          |
| scripts/app/entitycreator.js | Factory class for creating entities                                         |
| scripts/app/game.js          | Initializes and manages the world                                           |
| scripts/app/math.js          | Game related math utilities                                                 |
| scripts/app/tiledloader.js   | Custom PreloadJS loader for [Tiled's](http://www.mapeditor.org/) map format |

### Libraries, assets and tools
* [Bfxr - Sound Effect Tool](http://www.bfxr.net/)
* [Tiled - Map Editor](http://www.mapeditor.org/)
* [CC-BY 3.0 licensed 2D tiles and sprites by Hyptosis](http://opengameart.org/content/lots-of-free-2d-tiles-and-sprites-by-hyptosis)
* [CreateJS libraries for rendering, sound and loading assets](http://createjs.com/)
* [JavaScript inheritance](https://jsperf.com/fun-with-method-overrides/30) ([Blog post](http://techblog.netflix.com/2014/05/improving-performance-of-our-javascript.html))
* [RequireJS - Module loader](http://www.requirejs.org/)