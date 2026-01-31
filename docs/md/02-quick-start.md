# Quick Start

**Create your first game in 5 minutes**

---

## Installation

If you haven't installed the engine yet, see **[01-installation.md](01-installation.md)**.

---

## Create a New Game

```bash
node .origami/init.cjs my-platformer
```

You'll be asked:
1. **Game title** - Display name (e.g., "My Platformer")
2. **Template** - Choose "platformer" for a working example
3. **Author** - Your name (optional)
4. **Description** - Brief description (optional)

---

## Test Your Game

```bash
cd ../my-platformer
```

Open `index.html` in your browser. The game runs immediately!

**Controls**: WASD to move, Space to jump, F3 for debug mode

---

## Make Changes

Edit `objects/obj_player.ts` to change player behavior:

```typescript
step(): void {
  // Change movement speed
  const speed = 6; // Was 4

  if (keyboard_check(vk_a)) this.x -= speed;
  if (keyboard_check(vk_d)) this.x += speed;
}
```

Rebuild:
```bash
npm run build
```

Refresh browser to see changes!

---

## Next Steps

- **[04-gameobjects.md](04-gameobjects.md)** - Learn about GameObjects
- **[05-sprites.md](05-sprites.md)** - Working with sprites
- **[40-common-patterns.md](40-common-patterns.md)** - Best practices

---

[← Back to Index](README.md)
