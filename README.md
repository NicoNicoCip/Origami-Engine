# Origami Engine

A GameMaker-inspired 2D game framework for TypeScript and the browser.

## Features

- **TypeScript-First**: Full type safety and IntelliSense support
- **GameMaker-Style API**: Familiar `create()`, `step()`, `draw()` events and global functions
- **Canvas 2D Rendering**: Hardware-accelerated 2D graphics
- **No Dependencies**: Pure TypeScript, runs in any modern browser
- **Template System**: Quick start with fresh or platformer templates
- **Hot Reload**: Fast development with instant recompilation

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NicoNicoCip/Origami-Engine.git
cd Origami-Engine
```

### 2. Create a New Game Project

```bash
node .origami/init.cjs
```

You'll be prompted to:
- Enter a project name (e.g., `my-awesome-game`)
- Choose a template:
  - **1 = fresh**: Minimal empty project
  - **2 = platformer**: Complete platformer with player, enemies, and collectibles
- Enter a game title (display name for your game)

### 3. Start Developing

```bash
cd ../my-awesome-game
npm run dev
```

Open http://localhost:3000 in your browser to see your game!

## Development Workflow

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build standalone production bundle
- **`npm run serve`** - Serve production build

## Project Structure

A created game project looks like this:

```
my-game/
├── .origami/              # Origami Engine (framework code)
│   ├── engine/src/        # Engine TypeScript source
│   ├── docs/              # Full documentation
│   ├── build.cjs          # Build script
│   ├── dev.cjs            # Dev server
│   └── serve.cjs          # Static server
├── data/
│   ├── objects/           # Your game object classes (TypeScript)
│   ├── sprites/           # Sprite assets
│   └── rooms/             # Level/room definitions (JSON)
├── src/
│   └── main.ts            # Game entry point
├── game.json              # Game configuration
├── index.html             # HTML entry point
└── package.json           # npm dependencies
```

## Creating Game Objects

Game objects extend the `GameObject` class:

```typescript
import { GameObject } from '../.origami/engine/src/index.js';

export class obj_player extends GameObject {
  create(): void {
    this.x = 100;
    this.y = 100;
    this.sprite = 'spr_player';
  }

  step(): void {
    // WASD movement
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

## Documentation

Full documentation is included in every project at `.origami/docs/`:

- [Installation](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs/md/01-installation.md)
- [Quick Start](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs/md/02-quick-start.md)
- [GameObjects](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs/md/04-gameobjects.md)
- [API Reference](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs/md/21-api-global-functions.md)

## Updating the Engine

To update the Origami Engine in an existing project:

```bash
cd my-game
node .origami/update.cjs
```

This will fetch the latest engine version and update your `.origami/` folder while leaving your game code untouched.

## Templates

### Fresh Template
- Minimal empty project structure
- Single empty room
- Basic engine initialization
- Perfect for starting from scratch

### Platformer Template
- Complete working platformer game
- Player with WASD + Space controls
- Enemies with AI
- Collectibles
- Level design example

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Links

- [GitHub Repository](https://github.com/NicoNicoCip/Origami-Engine)
- [Documentation](https://github.com/NicoNicoCip/Origami-Engine/tree/engine/docs)
- [Issue Tracker](https://github.com/NicoNicoCip/Origami-Engine/issues)

---

**Version**: 1.0.0
**Author**: NicoNicoCip
**Inspired by**: GameMaker Studio 1.4
