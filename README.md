# {{GAME_TITLE}}

A platformer game built with [Origami Engine](https://github.com/NicoNicoCip/Origami-Engine).

## Features

- **Player Movement**: WASD keys for movement, Space to jump
- **Platforming Physics**: Gravity, jumping, collision detection
- **Enemies**: AI-controlled patrolling enemies
- **Collectibles**: Bobbing collectibles with respawn mechanic
- **Level Design**: Complete level with platforms and obstacles

## Controls

- **W/A/S/D** - Move player
- **Space** - Jump
- **F3** - Toggle debug overlay

## Getting Started

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

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
│   ├── objects/       # Game objects (player, wall, enemy, collectible)
│   ├── sprites/       # Sprite assets
│   └── rooms/         # Level definitions
├── src/
│   └── main.ts        # Game entry point
├── game.json          # Game configuration
└── index.html         # HTML entry point
```

## Game Objects

### obj_player
- WASD movement with 4 pixels/frame speed
- Jump with Space (12 pixel jump force)
- Gravity (0.5 pixels/frame²)
- Collision with walls

### obj_wall
- Solid collision object
- Static (no movement)

### obj_collectible
- Bobbing animation (sine wave)
- Respawns 3 seconds after collection
- Collision detection with player

### obj_enemy
- Horizontal patrol movement
- Changes direction every 3 seconds
- Affected by gravity

## Customizing

### Adding New Objects

1. Create new TypeScript class in `data/objects/`:
```typescript
import { GameObject } from '../.origami/engine/src/index.js';

export class obj_newobject extends GameObject {
  create(): void {
    // Initialize properties
  }

  step(): void {
    // Game logic
  }

  draw(): void {
    draw_self();
  }
}
```

2. Register in `src/main.ts`:
```typescript
import { obj_newobject } from '../data/objects/obj_newobject.js';
engine.registerObject(obj_newobject);
```

3. Add to `game.json`:
```json
{
  "objects": ["obj_player", "...", "obj_newobject"]
}
```

### Creating Sprites

1. Create folder: `data/sprites/spr_newsprite/`
2. Add frames: `frame_0.png`, `frame_1.png`, etc.
3. Add metadata.json:
```json
{
  "origin": { "x": 16, "y": 16 },
  "frames": 1,
  "fps": 10
}
```
4. Add to game.json: `"sprites": ["...", "spr_newsprite"]`

### Editing Rooms

Edit `data/rooms/room_level1.json` to change:
- Room size
- Background color
- Instance placement
- Camera/view settings

## Documentation

Full Origami Engine documentation is available in `.origami/docs/`.

## License

This game template is part of the Origami Engine project and is licensed under the MIT License.

## Learn More

- [Origami Engine](https://github.com/NicoNicoCip/Origami-Engine)
- [Documentation](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs)
