# Origami Engine - Core Runtime

This is the **engine branch** containing the Origami Engine source code, documentation, and build scripts.

## What's Here

This branch contains all the engine internals that get copied to the `.origami/` folder in game projects.

### Structure

```
├── engine/
│   └── src/                 # Engine TypeScript source code
│       ├── core/            # GameEngine, GameObject, InstanceManager
│       ├── rendering/       # Renderer, DrawingAPI
│       ├── input/           # Keyboard, Mouse managers
│       ├── collision/       # CollisionManager
│       ├── rooms/           # RoomManager, Room types
│       ├── sprites/         # SpriteManager, Sprite types
│       ├── storage/         # SaveManager
│       ├── debug/           # DebugManager
│       ├── globals/         # Global function injectors
│       ├── global.d.ts      # TypeScript global declarations
│       └── index.ts         # Public API exports
├── docs/                    # Full documentation (29 markdown files)
├── build.cjs                # Standalone bundler (asset inlining)
├── dev.cjs                  # Development server with hot reload
├── serve.cjs                # Static file server
├── update.cjs               # Engine update checker
├── package.json             # Engine dependencies
└── tsconfig.json            # TypeScript configuration
```

## For Engine Developers

If you're contributing to the Origami Engine itself:

### Building

```bash
npm install
npx tsc
```

### Testing Changes

1. Make changes to engine source code
2. Copy this entire branch to a test game's `.origami/` folder
3. Run the game and verify changes work

### Documentation

All documentation is in the `docs/` folder:
- User guides in `docs/md/`
- API reference in `docs/md/20-*.md` and `docs/md/21-*.md`

When adding features, update relevant documentation files.

## For Game Developers

**Don't clone this branch directly for making games!**

Instead, use the main branch installer:

```bash
git clone https://github.com/NicoNicoCip/Origami-Engine.git
cd Origami-Engine
node .origami/init.cjs
```

The installer will automatically copy this engine branch into your new game project.

## Version

Current version: **1.0.0**

## License

MIT License - see [LICENSE](LICENSE) for details.
