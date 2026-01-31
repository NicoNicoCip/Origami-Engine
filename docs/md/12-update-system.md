# Update System

**Keeping the Origami Engine up-to-date**

---

## Update Commands

The `node .origami/update.cjs` command has three modes:

### 1. Check for Updates (Read-Only)

```bash
node .origami/update.cjs check
```

Shows:
- Current version vs latest version
- Changelog of what's new
- Breaking changes warnings
- Compatibility status

**No changes are made** - safe to run anytime.

---

### 2. Update Engine Only

```bash
node .origami/update.cjs
```

What happens:
1. Checks for uncommitted changes (blocks if found)
2. Creates backup in `../.bkp/engine-<timestamp>/`
3. Fetches latest version from git
4. Rebuilds the engine
5. Updates config files

**Your game code is NOT modified**.

---

### 3. Full Update with Migration

```bash
node .origami/update.cjs full
```

Does everything from `node .origami/update.cjs`, plus:
- Runs migration scripts on your game code
- Updates deprecated function calls
- Adds new required methods
- Updates config files (game.json, etc.)
- Shows migration report

---

## Safety Features

### Automatic Backups

Every update creates a backup:
```
../.bkp/engine-2026-01-29-12-00/
└── metadata.json  # Git commit hash
```

Rollback if needed:
```bash
cd origami-engine
git reset --hard <commit-from-backup>
npm install && npm build
```

### Uncommitted Changes Check

Update blocked if you have uncommitted changes:
```
❌ You have uncommitted changes in your game project.
   Please commit or stash them first.
   Run: git status
```

### Version Locking

Lock to specific version in `.origami/config.json`:
```json
{
  "lockVersion": true
}
```

---

## Migration System

Migrations use AST (Abstract Syntax Tree) transformations to safely update code.

### Example: API Rename

**Before** (old API):
```typescript
instance_create_layer(x, y, 'obj_bullet');
```

**After** (new API):
```typescript
instance_create(x, y, 'obj_bullet');
```

Migration automatically renames it!

---

## Best Practices

1. **Commit before updating**
   ```bash
   git add .
   git commit -m "Save before engine update"
   node .origami/update.cjs
   ```

2. **Check first**
   ```bash
   node .origami/update.cjs check    # See what's changing
   node .origami/update.cjs          # Then update
   ```

3. **Test after updating**
   - Run your game
   - Test all features
   - Check for errors

---

[← Back to Index](README.md)
