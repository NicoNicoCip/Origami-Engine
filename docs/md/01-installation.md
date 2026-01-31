# Installation

**Setting up the Origami Engine on your system**

---

## Prerequisites

Before installing Origami Engine, ensure you have:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 8.0.0 or higher ([Install](https://npm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Check Versions

```bash
node --version   # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
git --version    # Any recent version
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/origami-engine
cd origami-engine
```

### 2. Run the Setup Wizard

```bash
npm run begin
```

This interactive setup will:
1. ✅ Check your environment (Node, npm, git)
2. ✅ Install all dependencies
3. ✅ Build the engine packages
4. ✅ Create configuration files
5. ✅ Install the global `ori` CLI command
6. ✅ Optionally create your first game project

### 3. Verify Installation

```bash
ori --version
```

You should see: `Origami Engine v0.1.0`

---

## What Gets Installed?

### Global CLI

The `ori` command becomes available system-wide:

```bash
node .origami/init.cjs my-game    # Create new game
node .origami/update.cjs check      # Check for updates
ori --help           # Show help
```

### Configuration Files

Two config files are created:

**~/.origami/config.json** (Global)
```json
{
  "enginePath": "/path/to/origami-engine",
  "version": "0.1.0",
  "installedAt": "2026-01-29T12:00:00.000Z"
}
```

**origami-engine/.origami/config.json** (Engine)
```json
{
  "version": "0.1.0",
  "lockVersion": false,
  "templateBranches": {
    "fresh": "template/fresh",
    "platformer": "template/platformer"
  },
  "migrations": {}
}
```

### Directory Structure

After installation:

```
parent-directory/
├── origami-engine/      # Engine repository
│   ├── packages/
│   │   ├── runtime/     # Core engine
│   │   └── cli/         # CLI tool
│   ├── .origami/        # Engine config
│   └── ...
└── my-first-game/       # Your game (if created during setup)
    ├── objects/
    ├── sprites/
    └── ...
```

---

## Troubleshooting

### "ori: command not found"

**Solution 1**: Restart your terminal

The PATH may need to refresh.

**Solution 2**: Manual linking

```bash
cd origami-engine/packages/cli
npm link --global
```

**Solution 3**: Use full path

```bash
node /path/to/origami-engine/packages/cli/dist/index.js
```

### Permission Errors

On Linux/macOS, you may need sudo:

```bash
sudo npm run begin
```

Or fix npm permissions: [npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

### npm Not Found

Install npm globally:

```bash
npm install -g npm
```

---

## Next Steps

- **[02-quick-start.md](02-quick-start.md)** - Create your first game
- **[03-creating-games.md](03-creating-games.md)** - Learn the `node .origami/init.cjs` command
- **[11-cli-reference.md](11-cli-reference.md)** - Explore all CLI commands

---

[← Back to Index](README.md)
