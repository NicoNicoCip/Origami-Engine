# {{GAME_TITLE}}

A fresh game project built with [Origami Engine](https://github.com/NicoNicoCip/Origami-Engine).

## Getting Started

This is a minimal template with an empty project structure. You can start building your game from scratch!

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see your game.

### Building

```bash
npm run build
```

Creates a standalone bundle in `build/game.js`.

### Serving Production Build

```bash
npm run serve
```

## Project Structure

```
├── .origami/          # Origami Engine (framework code)
├── data/
│   ├── objects/       # Game object TypeScript files (empty)
│   ├── sprites/       # Sprite assets (empty)
│   ├── rooms/         # Room definitions (has rm_main.json)
│   ├── backgrounds/   # Background images (empty)
│   ├── sounds/        # Audio files (empty)
│   ├── fonts/         # Font files (empty)
│   ├── scripts/       # Reusable scripts (empty)
│   ├── paths/         # Movement paths (empty)
│   ├── timelines/     # Timeline definitions (empty)
│   └── shaders/       # Custom shaders (empty)
├── src/
│   └── main.ts        # Game entry point
├── game.json          # Game configuration
└── index.html         # HTML entry point
```

## Creating Your First Game Object

1. Create a new file in `data/objects/`, for example `obj_player.ts`:

```typescript
/// <reference path="../../.origami/engine/src/global.d.ts" />
import { GameObject } from '../../.origami/engine/src/index.js';

export class obj_player extends GameObject {
  create(): void {
    this.x = 320;
    this.y = 240;
    this.sprite = 'spr_player';
  }

  step(): void {
    // Movement with WASD
    if (keyboard_check(vk_w)) this.y -= 4;
    if (keyboard_check(vk_s)) this.y += 4;
    if (keyboard_check(vk_a)) this.x -= 4;
    if (keyboard_check(vk_d)) this.x += 4;
  }

  draw(): void {
    draw_self();
  }
}
```

2. Register the object in `src/main.ts`:

```typescript
import { obj_player } from '../data/objects/obj_player.js';

// Inside startGame() function, before loadGameConfig:
engine.registerObject(obj_player);
```

3. Add the object to `game.json`:

```json
{
  "objects": ["obj_player"]
}
```

## Creating Sprites

1. Create a folder in `data/sprites/`, for example `spr_player/`
2. Add sprite frames: `frame_0.png`, `frame_1.png`, etc.
3. Create `metadata.json` in the sprite folder:

```json
{
  "origin": { "x": 16, "y": 16 },
  "frames": 1,
  "fps": 10
}
```

4. Add the sprite to `game.json`:

```json
{
  "sprites": ["spr_player"]
}
```

## Creating Rooms

1. Create a JSON file in `data/rooms/`, for example `room_level1.json`:

```json
{
  "name": "room_level1",
  "width": 640,
  "height": 480,
  "speed": 60,
  "backgroundColor": "#000000",
  "instances": [
    {
      "object": "obj_player",
      "x": 100,
      "y": 100
    }
  ],
  "views": [
    {
      "enabled": true,
      "xview": 0,
      "yview": 0,
      "wview": 640,
      "hview": 480,
      "xport": 0,
      "yport": 0,
      "wport": 640,
      "hport": 480,
      "hborder": 200,
      "vborder": 150,
      "hspeed": -1,
      "vspeed": -1,
      "object": "obj_player"
    }
  ],
  "backgrounds": []
}
```

2. Add the room to `game.json`:

```json
{
  "rooms": ["rm_main", "room_level1"],
  "startRoom": "room_level1"
}
```

## Controls

- **F3** - Toggle debug overlay

## Documentation

Full Origami Engine documentation is available in `.origami/docs/`:

- [GameObjects](../.origami/docs/md/04-gameobjects.md)
- [Sprites](../.origami/docs/md/05-sprites.md)
- [Rooms](../.origami/docs/md/07-rooms.md)
- [Input](../.origami/docs/md/08-input.md)
- [Drawing](../.origami/docs/md/09-drawing.md)
- [API Reference](../.origami/docs/md/21-api-global-functions.md)

## Updating the Engine

To update the Origami Engine in this project:

```bash
node .origami/update.cjs
```

## License

This game template is part of the Origami Engine project and is licensed under the MIT License.

## Learn More

- [Origami Engine](https://github.com/NicoNicoCip/Origami-Engine)
- [Documentation](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs)
