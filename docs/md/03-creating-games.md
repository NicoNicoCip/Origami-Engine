# Creating Games

**Using `node .origami/init.cjs` and project templates**

---

## The `node .origami/init.cjs` Command

Create a new game project:

```bash
node .origami/init.cjs <project-name>
```

---

## Interactive Wizard

The command launches an interactive wizard:

### Question 1: Project Name
```
Project name: my-game
```
- Use lowercase letters, numbers, hyphens, underscores
- This becomes the folder name

### Question 2: Game Title
```
Game title (display name, optional): My Awesome Game
```
- User-friendly display name
- Shown in game window/title

### Question 3: Template
```
Choose starting template:
  1. fresh - Empty project, build from scratch
  2. platformer - Working example to modify
Template (1-2): 2
```

### Question 4: Author
```
Author (optional): Your Name
```

### Question 5: Description
```
Description (optional): A fun platformer game
```

---

## Templates

### Fresh Template
- Empty project structure
- Minimal setup
- No example objects
- Start from scratch

### Platformer Template
- Complete working game
- Player with physics
- Enemies, collectibles
- Level design example
- Modify and learn

---

## Project Location

Projects are created as **siblings** to the engine:

```
parent-folder/
├── origami-engine/    # Engine
└── my-game/           # Your game
```

This keeps the engine and games separate.

---

## Next Steps

After creation:

```bash
cd ../my-game
# Open index.html in browser
```

See **[04-gameobjects.md](04-gameobjects.md)** to start coding!

---

[← Back to Index](README.md)
