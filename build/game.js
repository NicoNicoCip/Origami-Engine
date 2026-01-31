
// Inlined game data
window.__GAME_DATA__ = {"title":"Test Platformer Game","width":640,"height":480,"sprites":["spr_player","spr_wall","spr_collectible","spr_enemy"],"backgrounds":[],"sounds":[],"fonts":[],"scripts":[],"paths":[],"timelines":[],"shaders":[],"objects":["obj_player","obj_wall","obj_collectible","obj_enemy"],"rooms":["room_level1"],"startRoom":"room_level1"};
window.__ROOMS_DATA__ = {"room_level1":{"name":"room_level1","width":640,"height":480,"speed":165,"backgroundColor":"#87CEEB","instances":[{"object":"obj_player","x":100,"y":100},{"object":"obj_wall","x":0,"y":448},{"object":"obj_wall","x":32,"y":448},{"object":"obj_wall","x":64,"y":448},{"object":"obj_wall","x":96,"y":448},{"object":"obj_wall","x":128,"y":448},{"object":"obj_wall","x":160,"y":448},{"object":"obj_wall","x":192,"y":448},{"object":"obj_wall","x":224,"y":448},{"object":"obj_wall","x":256,"y":448},{"object":"obj_wall","x":288,"y":448},{"object":"obj_wall","x":320,"y":448},{"object":"obj_wall","x":352,"y":448},{"object":"obj_wall","x":384,"y":448},{"object":"obj_wall","x":416,"y":448},{"object":"obj_wall","x":448,"y":448},{"object":"obj_wall","x":480,"y":448},{"object":"obj_wall","x":512,"y":448},{"object":"obj_wall","x":544,"y":448},{"object":"obj_wall","x":576,"y":448},{"object":"obj_wall","x":608,"y":448},{"object":"obj_wall","x":200,"y":350},{"object":"obj_wall","x":232,"y":350},{"object":"obj_wall","x":264,"y":350},{"object":"obj_wall","x":400,"y":280},{"object":"obj_wall","x":432,"y":280},{"object":"obj_collectible","x":150,"y":400},{"object":"obj_collectible","x":232,"y":310},{"object":"obj_collectible","x":416,"y":240},{"object":"obj_enemy","x":300,"y":416}],"views":[{"enabled":true,"xview":0,"yview":0,"wview":640,"hview":480,"xport":0,"yport":0,"wport":640,"hport":480,"hborder":200,"vborder":150,"hspeed":-1,"vspeed":-1,"object":"obj_player"}]}};
window.__SPRITES_DATA__ = {"spr_player":{"metadata":{"origin":{"x":16,"y":16},"frames":1,"fps":10},"frames":["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAM0lEQVR4nO3QQQ0AAAgDMUA17iGo4NMZuKUZPROPq8+4AwQIECBAgAABAgQIECBAgMARLL1eArZWSaOUAAAAAElFTkSuQmCC"]},"spr_wall":{"metadata":{"origin":{"x":0,"y":0},"frames":1,"fps":10},"frames":["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAANElEQVR4nO3QwQ0AMAwCsTSTs3mrTsHHLHDIJ8md4rYZd4AAAQIECBAgQIAAAQIECBD4BA9PegK/ApsZlAAAAABJRU5ErkJggg=="]},"spr_collectible":{"metadata":{"origin":{"x":8,"y":8},"frames":1,"fps":10},"frames":["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR4nGNgoDX4f4fhPz55RlI1Maqg6mEi1UZ0eSZSNGNTx0SqZnT1TAwUAiZKDWBEdg7ZLmBEixqibVdhYBz4MGBCdg4pGmHqUVxArCHI6jC8QMgQkgOcUBQDAAcZHfOeeFnZAAAAAElFTkSuQmCC"]},"spr_enemy":{"metadata":{"origin":{"x":16,"y":16},"frames":1,"fps":10},"frames":["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAANElEQVR4nO3QQQ0AAAgDMUAX/m1BUMGnM3BLc7onHlefcQcIECBAgAABAgQIECBAgACBI1i/IAK2ZrjBJAAAAABJRU5ErkJggg=="]}};
window.__BACKGROUNDS_DATA__ = {};
window.__SOUNDS_DATA__ = {};
window.__FONTS_DATA__ = {};
window.__SCRIPTS_DATA__ = {};
window.__PATHS_DATA__ = {};
window.__TIMELINES_DATA__ = {};
window.__SHADERS_DATA__ = {};

// Override fetch to return inlined data
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    // Normalize URL
    const normalizedUrl = url.replace(/^\.\//, '').replace(/\\/g, '/');

    if (normalizedUrl === 'game.json' || normalizedUrl.endsWith('/game.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(window.__GAME_DATA__)
        });
    }

    // Check for room JSON files
    const roomMatch = normalizedUrl.match(/rooms\/([^/]+)\.json$/);
    if (roomMatch) {
        const roomName = roomMatch[1];
        if (window.__ROOMS_DATA__[roomName]) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(window.__ROOMS_DATA__[roomName])
            });
        }
    }

    // Check for sprite metadata
    const spriteMetadataMatch = normalizedUrl.match(/sprites\/([^/]+)\/metadata\.json$/);
    if (spriteMetadataMatch) {
        const spriteName = spriteMetadataMatch[1];
        if (window.__SPRITES_DATA__[spriteName]) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(window.__SPRITES_DATA__[spriteName].metadata)
            });
        }
    }

    // Check for sprite frame images
    const spriteFrameMatch = normalizedUrl.match(/sprites\/([^/]+)\/frame_(\d+)\.(png|jpg|jpeg|webp)$/);
    if (spriteFrameMatch) {
        const spriteName = spriteFrameMatch[1];
        const frameIndex = parseInt(spriteFrameMatch[2], 10);
        if (window.__SPRITES_DATA__[spriteName] && window.__SPRITES_DATA__[spriteName].frames[frameIndex]) {
            // Return base64 image as blob
            const base64Data = window.__SPRITES_DATA__[spriteName].frames[frameIndex];
            return fetch(base64Data);
        }
    }

    // Check for background images
    const backgroundMatch = normalizedUrl.match(/backgrounds\/([^/]+)\.(png|jpg|jpeg|webp)$/);
    if (backgroundMatch) {
        const bgName = backgroundMatch[1];
        if (window.__BACKGROUNDS_DATA__[bgName]) {
            return fetch(window.__BACKGROUNDS_DATA__[bgName]);
        }
    }

    // Check for sound files
    const soundMatch = normalizedUrl.match(/sounds\/([^/]+)\.(mp3|ogg|wav|m4a)$/);
    if (soundMatch) {
        const soundName = soundMatch[1];
        if (window.__SOUNDS_DATA__[soundName]) {
            return fetch(window.__SOUNDS_DATA__[soundName]);
        }
    }

    // Check for font files
    const fontMatch = normalizedUrl.match(/fonts\/([^/]+)\.(ttf|otf|woff|woff2)$/);
    if (fontMatch) {
        const fontName = fontMatch[1];
        if (window.__FONTS_DATA__[fontName]) {
            return fetch(window.__FONTS_DATA__[fontName]);
        }
    }

    // Check for script JSON files
    const scriptMatch = normalizedUrl.match(/scripts\/([^/]+)\.json$/);
    if (scriptMatch) {
        const scriptName = scriptMatch[1];
        if (window.__SCRIPTS_DATA__[scriptName]) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(window.__SCRIPTS_DATA__[scriptName])
            });
        }
    }

    // Check for path JSON files
    const pathMatch = normalizedUrl.match(/paths\/([^/]+)\.json$/);
    if (pathMatch) {
        const pathName = pathMatch[1];
        if (window.__PATHS_DATA__[pathName]) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(window.__PATHS_DATA__[pathName])
            });
        }
    }

    // Check for timeline JSON files
    const timelineMatch = normalizedUrl.match(/timelines\/([^/]+)\.json$/);
    if (timelineMatch) {
        const timelineName = timelineMatch[1];
        if (window.__TIMELINES_DATA__[timelineName]) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(window.__TIMELINES_DATA__[timelineName])
            });
        }
    }

    // Check for shader files
    const shaderVertMatch = normalizedUrl.match(/shaders\/([^/]+)\.vert$/);
    if (shaderVertMatch) {
        const shaderName = shaderVertMatch[1];
        if (window.__SHADERS_DATA__[shaderName]) {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(window.__SHADERS_DATA__[shaderName].vertex)
            });
        }
    }

    const shaderFragMatch = normalizedUrl.match(/shaders\/([^/]+)\.frag$/);
    if (shaderFragMatch) {
        const shaderName = shaderFragMatch[1];
        if (window.__SHADERS_DATA__[shaderName]) {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(window.__SHADERS_DATA__[shaderName].fragment)
            });
        }
    }

    // Fall back to original fetch for other resources
    return originalFetch.call(this, url, options);
};

"use strict";
(() => {
  // dist/.origami/engine/src/core/GameObject.js
  var gameObjectIdCounter = 0;
  var GameObject = class {
    constructor() {
      this.id = String(++gameObjectIdCounter);
      this.x = 0;
      this.y = 0;
      this.xprevious = 0;
      this.yprevious = 0;
      this.xstart = 0;
      this.ystart = 0;
      this.speed = 0;
      this.direction = 0;
      this.hspeed = 0;
      this.vspeed = 0;
      this.sprite_index = null;
      this.image_index = 0;
      this.image_speed = 1;
      this.image_alpha = 1;
      this.image_angle = 0;
      this.image_xscale = 1;
      this.image_yscale = 1;
      this.visible = true;
      this.depth = 0;
      this.order = 0;
      this.persistent = false;
      this._destroyed = false;
      this.objectType = this.constructor.name;
    }
    /**
     * Called when the instance is created
     */
    create() {
    }
    /**
     * Called every frame to update game logic
     */
    step() {
    }
    /**
     * Called every frame to render the instance
     * Default implementation automatically draws the sprite
     */
    draw() {
      if (this.sprite_index) {
        const g = globalThis;
        if (g.draw_self) {
          g.draw_self.call(this);
        }
      }
    }
    /**
     * Called when the game starts
     */
    gameStart() {
    }
    /**
     * Called when the game ends
     */
    gameEnd() {
    }
    /**
     * Called when entering a room
     */
    roomStart() {
    }
    /**
     * Called when leaving a room
     */
    roomEnd() {
    }
    /**
     * Set the engine reference (called internally)
     */
    setEngine(engine) {
      this.engine = engine;
    }
    /**
     * Check if this instance has been destroyed
     */
    isDestroyed() {
      return this._destroyed;
    }
    /**
     * Mark this instance as destroyed (called internally)
     */
    markDestroyed() {
      this._destroyed = true;
    }
    /**
     * Update built-in motion system
     * Called automatically before step()
     */
    updateMotion() {
      this.xprevious = this.x;
      this.yprevious = this.y;
      if (this.speed !== 0) {
        const lengthdir_x = (len, dir) => len * Math.cos(dir * Math.PI / 180);
        const lengthdir_y = (len, dir) => -len * Math.sin(dir * Math.PI / 180);
        this.hspeed = lengthdir_x(this.speed, this.direction);
        this.vspeed = lengthdir_y(this.speed, this.direction);
      }
      this.x += this.hspeed;
      this.y += this.vspeed;
    }
    /**
     * Update sprite animation
     * Called automatically before draw()
     */
    updateAnimation() {
      if (this.sprite_index && this.image_speed !== 0) {
        this.image_index += this.image_speed;
        const sprite = this.engine.getSpriteManager().getSprite(this.sprite_index);
        if (sprite) {
          const frameCount = sprite.frames.length;
          if (this.image_index >= frameCount) {
            this.image_index = this.image_index % frameCount;
          } else if (this.image_index < 0) {
            this.image_index = (frameCount + this.image_index % frameCount) % frameCount;
          }
        }
      }
    }
    // Collision helper methods
    place_meeting(x, y, objectType) {
      const targets = this.engine.getInstanceManager().getInstancesOfType(objectType);
      const collision = this.engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
      return collision !== null;
    }
    instance_place(x, y, objectType) {
      const targets = this.engine.getInstanceManager().getInstancesOfType(objectType);
      return this.engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
    }
    // Instance management helper
    instance_destroy() {
      this.engine.getInstanceManager().destroyInstance(this);
    }
  };

  // dist/.origami/engine/src/core/InstanceManager.js
  var InstanceManager = class {
    constructor(engine) {
      this.instances = [];
      this.objectRegistry = /* @__PURE__ */ new Map();
      this.instancesToDestroy = [];
      this.engine = engine;
    }
    /**
     * Register an object class
     */
    registerObjectClass(objectType, objectClass) {
      this.objectRegistry.set(objectType, objectClass);
    }
    /**
     * Create a new instance of an object
     */
    async createInstance(objectType, x, y) {
      const ObjectClass = this.objectRegistry.get(objectType);
      if (!ObjectClass) {
        throw new Error(`Object type not registered: ${objectType}`);
      }
      const instance = new ObjectClass();
      instance.setEngine(this.engine);
      instance.x = x;
      instance.y = y;
      instance.xstart = x;
      instance.ystart = y;
      this.instances.push(instance);
      instance.create();
      return instance;
    }
    /**
     * Destroy an instance
     */
    destroyInstance(instance) {
      if (!instance.isDestroyed()) {
        instance.markDestroyed();
        this.instancesToDestroy.push(instance);
      }
    }
    /**
     * Remove destroyed instances from the list
     */
    cleanupDestroyedInstances() {
      if (this.instancesToDestroy.length === 0)
        return;
      this.instances = this.instances.filter((inst) => !inst.isDestroyed());
      this.instancesToDestroy = [];
    }
    /**
     * Get all instances
     */
    getAllInstances() {
      return this.instances.filter((inst) => !inst.isDestroyed());
    }
    /**
     * Get instances of a specific type
     */
    getInstancesOfType(objectType) {
      return this.instances.filter((inst) => !inst.isDestroyed() && inst.objectType === objectType);
    }
    /**
     * Check if any instance of a type exists
     */
    instanceExists(objectType) {
      return this.instances.some((inst) => !inst.isDestroyed() && inst.objectType === objectType);
    }
    /**
     * Count instances of a type
     */
    instanceCount(objectType) {
      return this.instances.filter((inst) => !inst.isDestroyed() && inst.objectType === objectType).length;
    }
    /**
     * Find the nth instance of a type
     */
    instanceFind(objectType, n) {
      const instances = this.getInstancesOfType(objectType);
      return instances[n] || null;
    }
    /**
     * Get instance by ID
     */
    getInstanceById(id) {
      return this.instances.find((inst) => !inst.isDestroyed() && inst.id === id) || null;
    }
    /**
     * Sort instances by depth and order
     */
    sortInstances() {
      this.instances.sort((a, b) => {
        if (a.depth !== b.depth) {
          return b.depth - a.depth;
        }
        return a.order - b.order;
      });
    }
    /**
     * Update all instances
     */
    updateInstances() {
      const sortedInstances = [...this.instances].filter((inst) => !inst.isDestroyed()).sort((a, b) => a.order - b.order);
      for (const instance of sortedInstances) {
        if (!instance.isDestroyed()) {
          instance.updateMotion();
          instance.step();
        }
      }
      this.cleanupDestroyedInstances();
    }
    /**
     * Draw all instances
     */
    drawInstances(ctx) {
      this.sortInstances();
      for (const instance of this.instances) {
        if (!instance.isDestroyed() && instance.visible) {
          instance.updateAnimation();
          ctx.save();
          ctx.translate(instance.x, instance.y);
          ctx.rotate(instance.image_angle * Math.PI / 180);
          ctx.scale(instance.image_xscale, instance.image_yscale);
          ctx.globalAlpha = instance.image_alpha;
          instance.draw();
          ctx.restore();
        }
      }
    }
    /**
     * Clear all instances
     */
    clearAllInstances() {
      this.instances = [];
      this.instancesToDestroy = [];
    }
  };

  // dist/.origami/engine/src/sprites/SpriteManager.js
  var SpriteManager = class {
    constructor() {
      this.sprites = /* @__PURE__ */ new Map();
      this.loadingPromises = /* @__PURE__ */ new Map();
    }
    /**
     * Load a sprite from a folder
     * @param basePath Base path to sprites folder
     * @param spriteName Name of the sprite (folder name)
     */
    async loadSprite(basePath, spriteName) {
      if (this.sprites.has(spriteName)) {
        return this.sprites.get(spriteName);
      }
      if (this.loadingPromises.has(spriteName)) {
        return this.loadingPromises.get(spriteName);
      }
      const loadPromise = this._loadSpriteInternal(basePath, spriteName);
      this.loadingPromises.set(spriteName, loadPromise);
      try {
        const sprite = await loadPromise;
        this.sprites.set(spriteName, sprite);
        return sprite;
      } finally {
        this.loadingPromises.delete(spriteName);
      }
    }
    /**
     * Internal sprite loading logic
     */
    async _loadSpriteInternal(basePath, spriteName) {
      const spritePath = `${basePath}/${spriteName}`;
      const metadataResponse = await fetch(`${spritePath}/metadata.json`);
      if (!metadataResponse.ok) {
        throw new Error(`Failed to load metadata for sprite: ${spriteName}`);
      }
      const metadata = await metadataResponse.json();
      const frames = [];
      const frameCount = metadata.frames ?? 1;
      for (let i = 0; i < frameCount; i++) {
        try {
          const frame = await this._loadFrame(spritePath, i);
          frames.push(frame);
        } catch (error) {
          if (i === 0) {
            throw new Error(`No frames found for sprite: ${spriteName}`);
          } else {
            console.warn(`Frame ${i} not found for sprite: ${spriteName}, stopping at ${frames.length} frames`);
            break;
          }
        }
      }
      const width = frames[0].width;
      const height = frames[0].height;
      return {
        name: spriteName,
        frames,
        metadata,
        width,
        height
      };
    }
    /**
     * Load a single frame
     */
    async _loadFrame(spritePath, frameIndex) {
      const extensions = [".png", ".jpg", ".webp"];
      for (const ext of extensions) {
        const framePath = `${spritePath}/frame_${frameIndex}${ext}`;
        try {
          const image = await this._loadImage(framePath);
          return {
            image,
            width: image.width,
            height: image.height
          };
        } catch {
          continue;
        }
      }
      throw new Error(`Frame ${frameIndex} not found`);
    }
    /**
     * Load an image
     */
    _loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
      });
    }
    /**
     * Get a loaded sprite
     */
    getSprite(name) {
      return this.sprites.get(name);
    }
    /**
     * Check if a sprite is loaded
     */
    hasSprite(name) {
      return this.sprites.has(name);
    }
    /**
     * Get all loaded sprite names
     */
    getSpriteNames() {
      return Array.from(this.sprites.keys());
    }
    /**
     * Preload multiple sprites
     */
    async preloadSprites(basePath, spriteNames) {
      await Promise.all(spriteNames.map((name) => this.loadSprite(basePath, name)));
    }
  };

  // dist/.origami/engine/src/input/KeyboardManager.js
  var vk_anykey = 1;
  var KeyboardManager = class {
    constructor() {
      this.keysDown = /* @__PURE__ */ new Set();
      this.keysPressed = /* @__PURE__ */ new Set();
      this.keysReleased = /* @__PURE__ */ new Set();
      this.setupEventListeners();
    }
    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
      window.addEventListener("keydown", (e) => this.handleKeyDown(e));
      window.addEventListener("keyup", (e) => this.handleKeyUp(e));
      window.addEventListener("keydown", (e) => {
        if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
          e.preventDefault();
        }
      });
    }
    /**
     * Handle key down event
     */
    handleKeyDown(e) {
      const keyCode = e.keyCode;
      if (!this.keysDown.has(keyCode)) {
        this.keysPressed.add(keyCode);
      }
      this.keysDown.add(keyCode);
    }
    /**
     * Handle key up event
     */
    handleKeyUp(e) {
      const keyCode = e.keyCode;
      this.keysDown.delete(keyCode);
      this.keysReleased.add(keyCode);
    }
    /**
     * Check if a key is currently held down
     */
    check(key) {
      if (key === vk_anykey) {
        return this.keysDown.size > 0;
      }
      return this.keysDown.has(key);
    }
    /**
     * Check if a key was just pressed this frame
     */
    checkPressed(key) {
      if (key === vk_anykey) {
        return this.keysPressed.size > 0;
      }
      return this.keysPressed.has(key);
    }
    /**
     * Check if a key was just released this frame
     */
    checkReleased(key) {
      if (key === vk_anykey) {
        return this.keysReleased.size > 0;
      }
      return this.keysReleased.has(key);
    }
    /**
     * Clear pressed and released states (called at end of frame)
     */
    clearFrameStates() {
      this.keysPressed.clear();
      this.keysReleased.clear();
    }
  };

  // dist/.origami/engine/src/input/MouseManager.js
  var MouseManager = class {
    constructor(canvas2) {
      this.buttonsDown = /* @__PURE__ */ new Set();
      this.buttonsPressed = /* @__PURE__ */ new Set();
      this.buttonsReleased = /* @__PURE__ */ new Set();
      this.x = 0;
      this.y = 0;
      this.canvas = canvas2;
      this.setupEventListeners();
    }
    /**
     * Set up mouse event listeners
     */
    setupEventListeners() {
      this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
      this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
      this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
      this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.x = (e.clientX - rect.left) * scaleX;
      this.y = (e.clientY - rect.top) * scaleY;
    }
    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
      const button = e.button;
      if (!this.buttonsDown.has(button)) {
        this.buttonsPressed.add(button);
      }
      this.buttonsDown.add(button);
    }
    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
      const button = e.button;
      this.buttonsDown.delete(button);
      this.buttonsReleased.add(button);
    }
    /**
     * Check if a mouse button is currently held down
     */
    check(button) {
      return this.buttonsDown.has(button);
    }
    /**
     * Check if a mouse button was just pressed this frame
     */
    checkPressed(button) {
      return this.buttonsPressed.has(button);
    }
    /**
     * Check if a mouse button was just released this frame
     */
    checkReleased(button) {
      return this.buttonsReleased.has(button);
    }
    /**
     * Clear pressed and released states (called at end of frame)
     */
    clearFrameStates() {
      this.buttonsPressed.clear();
      this.buttonsReleased.clear();
    }
  };

  // dist/.origami/engine/src/collision/CollisionManager.js
  var CollisionManager = class {
    constructor(engine) {
      this.engine = engine;
    }
    /**
     * Get the bounding box for an instance
     */
    getBBox(instance) {
      if (!instance.sprite_index) {
        return {
          left: instance.x,
          top: instance.y,
          right: instance.x,
          bottom: instance.y
        };
      }
      const sprite = this.engine.getSpriteManager().getSprite(instance.sprite_index);
      if (!sprite) {
        return {
          left: instance.x,
          top: instance.y,
          right: instance.x,
          bottom: instance.y
        };
      }
      if (sprite.metadata.bbox) {
        const bbox = sprite.metadata.bbox;
        return {
          left: instance.x + bbox.left * instance.image_xscale,
          top: instance.y + bbox.top * instance.image_yscale,
          right: instance.x + bbox.right * instance.image_xscale,
          bottom: instance.y + bbox.bottom * instance.image_yscale
        };
      }
      const origin = sprite.metadata.origin;
      const width = sprite.width * instance.image_xscale;
      const height = sprite.height * instance.image_yscale;
      return {
        left: instance.x - origin.x * instance.image_xscale,
        top: instance.y - origin.y * instance.image_yscale,
        right: instance.x - origin.x * instance.image_xscale + width,
        bottom: instance.y - origin.y * instance.image_yscale + height
      };
    }
    /**
     * Check if two bounding boxes overlap
     */
    bboxOverlap(bbox1, bbox2) {
      return !(bbox1.right <= bbox2.left || bbox1.left >= bbox2.right || bbox1.bottom <= bbox2.top || bbox1.top >= bbox2.bottom);
    }
    /**
     * Check if a point is inside a bounding box
     */
    pointInBBox(x, y, bbox) {
      return x >= bbox.left && x < bbox.right && y >= bbox.top && y < bbox.bottom;
    }
    /**
     * Get the bounding box for an instance at a specific position
     */
    getBBoxAtPosition(instance, x, y) {
      const offset_x = x - instance.x;
      const offset_y = y - instance.y;
      const bbox = this.getBBox(instance);
      return {
        left: bbox.left + offset_x,
        top: bbox.top + offset_y,
        right: bbox.right + offset_x,
        bottom: bbox.bottom + offset_y
      };
    }
    /**
     * Check collision between an instance at a position and a list of instances
     */
    checkCollisionAtPosition(instance, x, y, targets) {
      const bbox = this.getBBoxAtPosition(instance, x, y);
      for (const target of targets) {
        if (target === instance || target.isDestroyed())
          continue;
        const targetBBox = this.getBBox(target);
        if (this.bboxOverlap(bbox, targetBBox)) {
          return target;
        }
      }
      return null;
    }
    /**
     * Check collision between a rectangle and instances
     */
    checkRectangleCollision(x1, y1, x2, y2, targets) {
      const rect = {
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
        right: Math.max(x1, x2),
        bottom: Math.max(y1, y2)
      };
      for (const target of targets) {
        if (target.isDestroyed())
          continue;
        const targetBBox = this.getBBox(target);
        if (this.bboxOverlap(rect, targetBBox)) {
          return target;
        }
      }
      return null;
    }
    /**
     * Check collision at a point
     */
    checkPointCollision(x, y, targets) {
      for (const target of targets) {
        if (target.isDestroyed())
          continue;
        const targetBBox = this.getBBox(target);
        if (this.pointInBBox(x, y, targetBBox)) {
          return target;
        }
      }
      return null;
    }
    /**
     * Get all instances colliding with an instance at a position
     */
    getAllCollisionsAtPosition(instance, x, y, targets) {
      const bbox = this.getBBoxAtPosition(instance, x, y);
      const collisions = [];
      for (const target of targets) {
        if (target === instance || target.isDestroyed())
          continue;
        const targetBBox = this.getBBox(target);
        if (this.bboxOverlap(bbox, targetBBox)) {
          collisions.push(target);
        }
      }
      return collisions;
    }
  };

  // dist/.origami/engine/src/rooms/room.js
  var Room = class {
    constructor(definition) {
      this.name = definition.name;
      this.width = definition.width;
      this.height = definition.height;
      this.speed = definition.speed;
      this.backgroundColor = definition.backgroundColor;
      this.views = definition.views || [this.createDefaultView()];
      this.backgrounds = definition.backgrounds || [];
    }
    /**
     * Create a default view
     */
    createDefaultView() {
      return {
        enabled: true,
        xview: 0,
        yview: 0,
        wview: this.width,
        hview: this.height,
        xport: 0,
        yport: 0,
        wport: this.width,
        hport: this.height,
        hborder: 0,
        vborder: 0,
        hspeed: -1,
        vspeed: -1,
        object: null
      };
    }
    /**
     * Get the active view (view[0])
     */
    getView() {
      return this.views[0];
    }
    /**
     * Update view to follow target object
     */
    updateView(targetX, targetY) {
      const view = this.getView();
      if (!view.enabled)
        return;
      const viewCenterX = view.xview + view.wview / 2;
      const viewCenterY = view.yview + view.hview / 2;
      const leftBorder = view.xview + view.hborder;
      const rightBorder = view.xview + view.wview - view.hborder;
      const topBorder = view.yview + view.vborder;
      const bottomBorder = view.yview + view.hview - view.vborder;
      let newXView = view.xview;
      let newYView = view.yview;
      if (targetX < leftBorder) {
        newXView = targetX - view.hborder;
      } else if (targetX > rightBorder) {
        newXView = targetX - view.wview + view.hborder;
      }
      if (targetY < topBorder) {
        newYView = targetY - view.vborder;
      } else if (targetY > bottomBorder) {
        newYView = targetY - view.hview + view.vborder;
      }
      newXView = Math.max(0, Math.min(newXView, this.width - view.wview));
      newYView = Math.max(0, Math.min(newYView, this.height - view.hview));
      view.xview = newXView;
      view.yview = newYView;
    }
  };

  // dist/.origami/engine/src/rooms/RoomManager.js
  var RoomManager = class {
    constructor(engine) {
      this.rooms = /* @__PURE__ */ new Map();
      this.currentRoom = null;
      this.currentRoomDefinition = null;
      this.engine = engine;
    }
    /**
     * Register a room definition
     */
    registerRoom(definition) {
      this.rooms.set(definition.name, definition);
    }
    /**
     * Load a room from JSON
     */
    async loadRoomDefinition(basePath, roomName) {
      const roomPath = `${basePath}/${roomName}.json`;
      const response = await fetch(roomPath);
      if (!response.ok) {
        throw new Error(`Failed to load room: ${roomName}`);
      }
      const definition = await response.json();
      definition.name = roomName;
      this.registerRoom(definition);
      return definition;
    }
    /**
     * Go to a room
     */
    async gotoRoom(roomName) {
      const definition = this.rooms.get(roomName);
      if (!definition) {
        throw new Error(`Room not found: ${roomName}`);
      }
      if (this.currentRoom) {
        const instances2 = this.engine.getInstanceManager().getAllInstances();
        for (const instance of instances2) {
          if (!instance.persistent) {
            instance.roomEnd();
          }
        }
        const instanceManager = this.engine.getInstanceManager();
        for (const instance of instances2) {
          if (!instance.persistent) {
            instanceManager.destroyInstance(instance);
          }
        }
      }
      await this.preloadRoomAssets(definition);
      this.currentRoom = new Room(definition);
      this.currentRoomDefinition = definition;
      this.updateGlobalRoomVariables();
      await this.createRoomInstances(definition.instances);
      const instances = this.engine.getInstanceManager().getAllInstances();
      for (const instance of instances) {
        instance.roomStart();
      }
      this.engine.getRenderer().resizeCanvas();
    }
    /**
     * Preload assets needed for the room
     */
    async preloadRoomAssets(definition) {
      const spriteManager = this.engine.getSpriteManager();
      const spritesToLoad = /* @__PURE__ */ new Set();
      for (const instance of definition.instances) {
        const spriteName = instance.object.replace("obj_", "spr_");
        spritesToLoad.add(spriteName);
      }
      if (definition.backgrounds) {
        for (const bg of definition.backgrounds) {
          if (bg.image) {
            spritesToLoad.add(bg.image);
          }
        }
      }
      const basePath = this.engine.getConfig().assetsPath + "/sprites";
      for (const spriteName of spritesToLoad) {
        try {
          await spriteManager.loadSprite(basePath, spriteName);
        } catch (error) {
          console.warn(`Failed to load sprite: ${spriteName}`, error);
        }
      }
    }
    /**
     * Create instances defined in the room
     */
    async createRoomInstances(instances) {
      const instanceManager = this.engine.getInstanceManager();
      for (const instanceDef of instances) {
        try {
          const instance = await instanceManager.createInstance(instanceDef.object, instanceDef.x, instanceDef.y);
          if (instanceDef.creationCode) {
            try {
              const func = new Function("instance", instanceDef.creationCode);
              func(instance);
            } catch (error) {
              console.error(`Error in creation code for ${instanceDef.object}:`, error);
            }
          }
        } catch (error) {
          console.error(`Failed to create instance: ${instanceDef.object}`, error);
        }
      }
    }
    /**
     * Update global room variables
     */
    updateGlobalRoomVariables() {
      if (this.currentRoom) {
        globalThis.room_width = this.currentRoom.width;
        globalThis.room_height = this.currentRoom.height;
        globalThis.room_speed = this.currentRoom.speed;
      }
    }
    /**
     * Get the current room
     */
    getCurrentRoom() {
      return this.currentRoom;
    }
    /**
     * Get the current room definition
     */
    getCurrentRoomDefinition() {
      return this.currentRoomDefinition;
    }
    /**
     * Check if a room exists
     */
    hasRoom(roomName) {
      return this.rooms.has(roomName);
    }
  };

  // dist/.origami/engine/src/rendering/renderer.js
  var Renderer = class {
    constructor(engine, canvas2) {
      this.currentColor = "#FFFFFF";
      this.currentAlpha = 1;
      this.currentFont = "12px Arial";
      this.engine = engine;
      this.canvas = canvas2;
      const ctx = canvas2.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get 2D context from canvas");
      }
      this.ctx = ctx;
      this.setupCanvas();
    }
    /**
     * Set up canvas to scale to window
     */
    setupCanvas() {
      window.addEventListener("resize", () => this.resizeCanvas());
    }
    /**
     * Resize the canvas to fit the current room
     */
    resizeCanvas() {
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (!room)
        return;
      const view = room.getView();
      const scaleX = window.innerWidth / view.wview;
      const scaleY = window.innerHeight / view.hview;
      const scale = Math.min(scaleX, scaleY);
      this.canvas.width = view.wview;
      this.canvas.height = view.hview;
      this.canvas.style.width = `${view.wview * scale}px`;
      this.canvas.style.height = `${view.hview * scale}px`;
    }
    /**
     * Get the canvas
     */
    getCanvas() {
      return this.canvas;
    }
    /**
     * Get the rendering context
     */
    getContext() {
      return this.ctx;
    }
    /**
     * Clear the canvas
     */
    clear(color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * Begin rendering a frame
     */
    beginFrame() {
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (!room)
        return;
      this.clear(room.backgroundColor);
      this.drawBackgrounds();
      this.currentColor = "#FFFFFF";
      this.currentAlpha = 1;
      this.ctx.globalAlpha = 1;
    }
    /**
     * Draw backgrounds
     */
    drawBackgrounds() {
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (!room)
        return;
      const view = room.getView();
      for (const bg of room.backgrounds) {
        if (!bg.visible || !bg.image)
          continue;
        const sprite = this.engine.getSpriteManager().getSprite(bg.image);
        if (!sprite || sprite.frames.length === 0)
          continue;
        const image = sprite.frames[0].image;
        if (bg.htiled || bg.vtiled) {
          const startX = bg.htiled ? Math.floor((view.xview + bg.x) / sprite.width) * sprite.width - bg.x - view.xview : bg.x - view.xview;
          const startY = bg.vtiled ? Math.floor((view.yview + bg.y) / sprite.height) * sprite.height - bg.y - view.yview : bg.y - view.yview;
          const endX = bg.htiled ? this.canvas.width : startX + sprite.width;
          const endY = bg.vtiled ? this.canvas.height : startY + sprite.height;
          for (let x = startX; x < endX; x += sprite.width) {
            for (let y = startY; y < endY; y += sprite.height) {
              this.ctx.drawImage(image, x, y);
            }
          }
        } else {
          this.ctx.drawImage(image, bg.x - view.xview, bg.y - view.yview);
        }
      }
    }
    /**
     * Render a frame
     */
    render() {
      this.beginFrame();
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (room) {
        const view = room.getView();
        this.ctx.save();
        this.ctx.translate(-view.xview, -view.yview);
        this.engine.getInstanceManager().drawInstances(this.ctx);
        this.ctx.restore();
      }
      if (this.engine.isDebugMode()) {
        this.engine.getDebugManager().draw(this.ctx);
      }
    }
    /**
     * Set drawing color
     */
    setColor(color) {
      this.currentColor = color;
    }
    /**
     * Set drawing alpha
     */
    setAlpha(alpha) {
      this.currentAlpha = Math.max(0, Math.min(1, alpha));
    }
    /**
     * Get current color
     */
    getColor() {
      return this.currentColor;
    }
    /**
     * Get current alpha
     */
    getAlpha() {
      return this.currentAlpha;
    }
    /**
     * Set font
     */
    setFont(font) {
      this.currentFont = font;
    }
    /**
     * Get current font
     */
    getFont() {
      return this.currentFont;
    }
  };

  // dist/.origami/engine/src/storage/SaveManager.js
  var SaveManager = class {
    constructor(gameId = "default") {
      this.storagePrefix = "origami_game_";
      this.storagePrefix = `origami_game_${gameId}_`;
    }
    /**
     * Save data to a slot
     */
    save(slot, data) {
      try {
        const key = this.getKey(slot);
        const json = JSON.stringify(data);
        localStorage.setItem(key, json);
        return true;
      } catch (error) {
        console.error("Failed to save game:", error);
        return false;
      }
    }
    /**
     * Load data from a slot
     */
    load(slot) {
      try {
        const key = this.getKey(slot);
        const json = localStorage.getItem(key);
        if (json === null) {
          return null;
        }
        return JSON.parse(json);
      } catch (error) {
        console.error("Failed to load game:", error);
        return null;
      }
    }
    /**
     * Check if a save exists in a slot
     */
    exists(slot) {
      const key = this.getKey(slot);
      return localStorage.getItem(key) !== null;
    }
    /**
     * Delete a save from a slot
     */
    delete(slot) {
      try {
        const key = this.getKey(slot);
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error("Failed to delete save:", error);
        return false;
      }
    }
    /**
     * Get all save slots
     */
    getAllSlots() {
      const slots = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const slot = key.substring(this.storagePrefix.length);
          slots.push(slot);
        }
      }
      return slots;
    }
    /**
     * Clear all saves
     */
    clearAll() {
      try {
        const slots = this.getAllSlots();
        for (const slot of slots) {
          this.delete(slot);
        }
        return true;
      } catch (error) {
        console.error("Failed to clear saves:", error);
        return false;
      }
    }
    /**
     * Get the storage key for a slot
     */
    getKey(slot) {
      return `${this.storagePrefix}${slot}`;
    }
  };
  function initializeSaveGlobals(saveManager) {
    const g = globalThis;
    g.game_save = function(slot) {
      const saveData = {
        timestamp: Date.now()
        // Add custom data here
      };
      return saveManager.save(slot, saveData);
    };
    g.game_load = function(slot) {
      const data = saveManager.load(slot);
      if (data === null) {
        return false;
      }
      return true;
    };
    g.game_save_exists = function(slot) {
      return saveManager.exists(slot);
    };
    g.game_save_delete = function(slot) {
      return saveManager.delete(slot);
    };
  }

  // dist/.origami/engine/src/debug/DebugManager.js
  var DEBUG_COLORS = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#FFC0CB"
  ];
  var DebugManager = class {
    constructor(engine) {
      this.enabled = false;
      this.showCollisionBoxes = true;
      this.showFPS = true;
      this.showInstanceCount = true;
      this.fps = 60;
      this.frameCount = 0;
      this.lastFPSUpdate = 0;
      this.objectColorMap = /* @__PURE__ */ new Map();
      this.colorIndex = 0;
      this.engine = engine;
      this.setupKeyboardShortcut();
    }
    /**
     * Set up F3/~ keyboard shortcut to toggle debug mode
     */
    setupKeyboardShortcut() {
      window.addEventListener("keydown", (e) => {
        if (e.key === "F3" || e.key === "`" || e.key === "~") {
          this.toggle();
          e.preventDefault();
        }
      });
    }
    /**
     * Toggle debug mode
     */
    toggle() {
      this.enabled = !this.enabled;
      globalThis.debug_mode = this.enabled;
      console.log(`Debug mode: ${this.enabled ? "ON" : "OFF"}`);
    }
    /**
     * Check if debug mode is enabled
     */
    isEnabled() {
      return this.enabled;
    }
    /**
     * Update debug info (called each frame)
     */
    update(deltaTime) {
      if (!this.enabled)
        return;
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFPSUpdate >= 1e3) {
        this.fps = Math.round(this.frameCount * 1e3 / (now - this.lastFPSUpdate));
        this.frameCount = 0;
        this.lastFPSUpdate = now;
      }
    }
    /**
     * Draw debug overlay
     */
    draw(ctx) {
      if (!this.enabled)
        return;
      if (this.showCollisionBoxes) {
        this.drawCollisionBoxes(ctx);
      }
      this.drawDebugInfo(ctx);
    }
    /**
     * Draw collision boxes for all instances
     */
    drawCollisionBoxes(ctx) {
      const instances = this.engine.getInstanceManager().getAllInstances();
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (!room)
        return;
      const view = room.getView();
      ctx.save();
      ctx.translate(-view.xview, -view.yview);
      ctx.lineWidth = 2;
      for (const instance of instances) {
        if (instance.isDestroyed() || !instance.visible)
          continue;
        const color = this.getColorForObjectType(instance.objectType);
        const bbox = this.engine.getCollisionManager().getBBox(instance);
        ctx.strokeStyle = color;
        ctx.strokeRect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
        ctx.fillStyle = color;
        ctx.fillRect(instance.x - 2, instance.y - 2, 4, 4);
      }
      ctx.restore();
    }
    /**
     * Draw debug info text
     */
    drawDebugInfo(ctx) {
      const instances = this.engine.getInstanceManager().getAllInstances();
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(10, 10, 200, 80);
      ctx.fillStyle = "#00FF00";
      ctx.font = "14px monospace";
      let y = 30;
      if (this.showFPS) {
        ctx.fillText(`FPS: ${this.fps}`, 20, y);
        y += 20;
      }
      if (this.showInstanceCount) {
        ctx.fillText(`Instances: ${instances.length}`, 20, y);
        y += 20;
      }
      const room = this.engine.getRoomManager().getCurrentRoom();
      if (room) {
        const view = room.getView();
        ctx.fillText(`View: (${Math.floor(view.xview)}, ${Math.floor(view.yview)})`, 20, y);
        y += 20;
      }
      ctx.restore();
    }
    /**
     * Get a consistent color for an object type
     */
    getColorForObjectType(objectType) {
      if (!this.objectColorMap.has(objectType)) {
        const color = DEBUG_COLORS[this.colorIndex % DEBUG_COLORS.length];
        this.objectColorMap.set(objectType, color);
        this.colorIndex++;
      }
      return this.objectColorMap.get(objectType);
    }
    /**
     * Log instance properties (for debug wrapping)
     */
    logInstance(instance) {
      console.log("=== Instance Debug ===");
      console.log("Type:", instance.objectType);
      console.log("ID:", instance.id);
      console.log("Position:", { x: instance.x, y: instance.y });
      console.log("Sprite:", instance.sprite_index);
      console.log("Visible:", instance.visible);
      console.log("Depth:", instance.depth);
      console.log("Properties:", instance);
      console.log("=====================");
    }
  };

  // dist/.origami/engine/src/globals/GlobalFunctions.js
  function initializeGlobalFunctions(engine) {
    const g = globalThis;
    g.instance_create = async function(x, y, objectType) {
      return await engine.getInstanceManager().createInstance(objectType, x, y);
    };
    g.instance_destroy = function() {
      engine.getInstanceManager().destroyInstance(this);
    };
    g.instance_exists = function(objectType) {
      return engine.getInstanceManager().instanceExists(objectType);
    };
    g.instance_number = function(objectType) {
      return engine.getInstanceManager().instanceCount(objectType);
    };
    g.instance_find = function(objectType, n) {
      return engine.getInstanceManager().instanceFind(objectType, n);
    };
    g.place_meeting = function(x, y, objectType) {
      const targets = engine.getInstanceManager().getInstancesOfType(objectType);
      const collision = engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
      return collision !== null;
    };
    g.place_free = function(x, y) {
      const allInstances = engine.getInstanceManager().getAllInstances();
      const collision = engine.getCollisionManager().checkCollisionAtPosition(this, x, y, allInstances);
      return collision === null;
    };
    g.instance_place = function(x, y, objectType) {
      const targets = engine.getInstanceManager().getInstancesOfType(objectType);
      return engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
    };
    g.instance_position = function(x, y, objectType) {
      const targets = engine.getInstanceManager().getInstancesOfType(objectType);
      return engine.getCollisionManager().checkPointCollision(x, y, targets);
    };
    g.collision_rectangle = function(x1, y1, x2, y2, objectType) {
      const targets = engine.getInstanceManager().getInstancesOfType(objectType);
      return engine.getCollisionManager().checkRectangleCollision(x1, y1, x2, y2, targets);
    };
    g.collision_point = function(x, y, objectType) {
      const targets = engine.getInstanceManager().getInstancesOfType(objectType);
      return engine.getCollisionManager().checkPointCollision(x, y, targets);
    };
    g.lengthdir_x = function(length, direction) {
      return length * Math.cos(direction * Math.PI / 180);
    };
    g.lengthdir_y = function(length, direction) {
      return -length * Math.sin(direction * Math.PI / 180);
    };
    g.point_direction = function(x1, y1, x2, y2) {
      const angle = Math.atan2(-(y2 - y1), x2 - x1) * (180 / Math.PI);
      return angle < 0 ? angle + 360 : angle;
    };
    g.point_distance = function(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };
    g.move_towards_point = function(x, y, speed) {
      const direction = g.point_direction(this.x, this.y, x, y);
      this.hspeed = g.lengthdir_x(speed, direction);
      this.vspeed = g.lengthdir_y(speed, direction);
    };
    g.random = function(n) {
      return Math.random() * n;
    };
    g.irandom = function(n) {
      return Math.floor(Math.random() * (n + 1));
    };
    g.random_range = function(min, max) {
      return min + Math.random() * (max - min);
    };
    g.choose = function(...args) {
      return args[Math.floor(Math.random() * args.length)];
    };
    g.clamp = function(value, min, max) {
      return Math.min(Math.max(value, min), max);
    };
    g.lerp = function(a, b, t) {
      return a + (b - a) * t;
    };
    g.room_goto = async function(roomName) {
      await engine.getRoomManager().gotoRoom(roomName);
    };
    g.game_end = function() {
      engine.stop();
    };
    g.game_restart = function() {
      engine.restart();
    };
    g.show_debug_message = function(message) {
      const caller = this?.objectType || "global";
      console.log(`[${caller}] ${message}`);
    };
    g.room_width = 0;
    g.room_height = 0;
    g.room_speed = 60;
    g.debug_mode = false;
    g.view_xview = 0;
    g.view_yview = 0;
    g.view_wview = 0;
    g.view_hview = 0;
    g.view_xport = 0;
    g.view_yport = 0;
    g.view_wport = 0;
    g.view_hport = 0;
  }
  function updateGlobalViewVariables(engine) {
    const g = globalThis;
    const room = engine.getRoomManager().getCurrentRoom();
    if (room) {
      const view = room.getView();
      g.view_xview = view.xview;
      g.view_yview = view.yview;
      g.view_wview = view.wview;
      g.view_hview = view.hview;
      g.view_xport = view.xport;
      g.view_yport = view.yport;
      g.view_wport = view.wport;
      g.view_hport = view.hport;
    }
  }

  // dist/.origami/engine/src/globals/InputGlobals.js
  function initializeInputGlobals(engine) {
    const g = globalThis;
    g.keyboard_check = function(key) {
      return engine.getKeyboardManager().check(key);
    };
    g.keyboard_check_pressed = function(key) {
      return engine.getKeyboardManager().checkPressed(key);
    };
    g.keyboard_check_released = function(key) {
      return engine.getKeyboardManager().checkReleased(key);
    };
    g.mouse_check_button = function(button) {
      return engine.getMouseManager().check(button);
    };
    g.mouse_check_button_pressed = function(button) {
      return engine.getMouseManager().checkPressed(button);
    };
    g.mouse_check_button_released = function(button) {
      return engine.getMouseManager().checkReleased(button);
    };
    Object.defineProperty(g, "mouse_x", {
      get: () => engine.getMouseManager().x,
      configurable: true
    });
    Object.defineProperty(g, "mouse_y", {
      get: () => engine.getMouseManager().y,
      configurable: true
    });
  }

  // dist/.origami/engine/src/rendering/DrawingAPI.js
  function initializeDrawingAPI(engine) {
    const g = globalThis;
    const ctx = engine.getRenderer().getContext();
    const renderer = engine.getRenderer();
    g.draw_sprite = function(sprite, subimg, x, y) {
      const spriteData = engine.getSpriteManager().getSprite(sprite);
      if (!spriteData || spriteData.frames.length === 0) {
        drawMissingSprite(ctx, x, y, 32, 32);
        return;
      }
      const frameIndex = Math.floor(subimg) % spriteData.frames.length;
      const frame = spriteData.frames[frameIndex];
      const origin = spriteData.metadata.origin;
      ctx.drawImage(frame.image, x - origin.x, y - origin.y);
    };
    g.draw_self = function() {
      const instance = this;
      if (!instance.sprite_index)
        return;
      const spriteData = engine.getSpriteManager().getSprite(instance.sprite_index);
      if (!spriteData || spriteData.frames.length === 0) {
        drawMissingSprite(ctx, 0, 0, 32, 32);
        return;
      }
      const frameIndex = Math.floor(instance.image_index) % spriteData.frames.length;
      const frame = spriteData.frames[frameIndex];
      const origin = spriteData.metadata.origin;
      ctx.drawImage(frame.image, -origin.x, -origin.y);
    };
    g.draw_text = function(x, y, text) {
      ctx.save();
      ctx.fillStyle = renderer.getColor();
      ctx.globalAlpha = renderer.getAlpha();
      ctx.font = renderer.getFont();
      ctx.fillText(String(text), x, y);
      ctx.restore();
    };
    g.draw_rectangle = function(x1, y1, x2, y2, outline) {
      ctx.save();
      ctx.fillStyle = renderer.getColor();
      ctx.strokeStyle = renderer.getColor();
      ctx.globalAlpha = renderer.getAlpha();
      if (outline) {
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      } else {
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      }
      ctx.restore();
    };
    g.draw_circle = function(x, y, radius, outline) {
      ctx.save();
      ctx.fillStyle = renderer.getColor();
      ctx.strokeStyle = renderer.getColor();
      ctx.globalAlpha = renderer.getAlpha();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (outline) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      ctx.restore();
    };
    g.draw_set_color = function(color) {
      renderer.setColor(color);
    };
    g.draw_set_alpha = function(alpha) {
      renderer.setAlpha(alpha);
    };
    g.draw_sprite_ext = function(sprite, subimg, x, y, xscale, yscale, angle, color, alpha) {
      const spriteData = engine.getSpriteManager().getSprite(sprite);
      if (!spriteData || spriteData.frames.length === 0) {
        drawMissingSprite(ctx, x, y, 32, 32);
        return;
      }
      const frameIndex = Math.floor(subimg) % spriteData.frames.length;
      const frame = spriteData.frames[frameIndex];
      const origin = spriteData.metadata.origin;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);
      ctx.scale(xscale, yscale);
      ctx.drawImage(frame.image, -origin.x, -origin.y);
      ctx.restore();
    };
    g.draw_line = function(x1, y1, x2, y2) {
      ctx.save();
      ctx.strokeStyle = renderer.getColor();
      ctx.globalAlpha = renderer.getAlpha();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };
    g.draw_set_font = function(font) {
      renderer.setFont(font);
    };
    g.draw_set_halign = function(align) {
      ctx.textAlign = align;
    };
    g.draw_set_valign = function(align) {
      const alignMap = { top: "top", middle: "middle", bottom: "bottom" };
      ctx.textBaseline = alignMap[align];
    };
    function drawMissingSprite(ctx2, x, y, width, height) {
      const tileSize = 8;
      for (let ty = 0; ty < height; ty += tileSize) {
        for (let tx = 0; tx < width; tx += tileSize) {
          const isEven = (tx / tileSize + ty / tileSize) % 2 === 0;
          ctx2.fillStyle = isEven ? "#FF00FF" : "#000000";
          ctx2.fillRect(x + tx, y + ty, tileSize, tileSize);
        }
      }
    }
  }

  // dist/.origami/engine/src/core/GameEngine.js
  var GameEngine = class {
    constructor(config) {
      this.running = false;
      this.lastFrameTime = 0;
      this.targetFrameTime = 1e3 / 60;
      this.animationFrameId = null;
      this.gameStarted = false;
      this.config = config;
      this.canvas = config.canvas;
      this.instanceManager = new InstanceManager(this);
      this.spriteManager = new SpriteManager();
      this.keyboardManager = new KeyboardManager();
      this.mouseManager = new MouseManager(this.canvas);
      this.collisionManager = new CollisionManager(this);
      this.roomManager = new RoomManager(this);
      this.renderer = new Renderer(this, this.canvas);
      this.saveManager = new SaveManager(config.gameId);
      this.debugManager = new DebugManager(this);
      this.initializeGlobals();
    }
    /**
     * Initialize global functions
     */
    initializeGlobals() {
      initializeGlobalFunctions(this);
      initializeInputGlobals(this);
      initializeDrawingAPI(this);
      initializeSaveGlobals(this.saveManager);
      this.exportInputConstants();
    }
    /**
     * Export input constants to global scope
     */
    exportInputConstants() {
      const g = globalThis;
      g.vk_nokey = 0;
      g.vk_anykey = 1;
      g.vk_left = 37;
      g.vk_right = 39;
      g.vk_up = 38;
      g.vk_down = 40;
      g.vk_enter = 13;
      g.vk_escape = 27;
      g.vk_space = 32;
      g.vk_shift = 16;
      g.vk_control = 17;
      g.vk_alt = 18;
      g.vk_backspace = 8;
      g.vk_tab = 9;
      g.vk_home = 36;
      g.vk_end = 35;
      g.vk_delete = 46;
      g.vk_insert = 45;
      g.vk_pageup = 33;
      g.vk_pagedown = 34;
      g.vk_pause = 19;
      g.vk_printscreen = 44;
      g.vk_f1 = 112;
      g.vk_f2 = 113;
      g.vk_f3 = 114;
      g.vk_f4 = 115;
      g.vk_f5 = 116;
      g.vk_f6 = 117;
      g.vk_f7 = 118;
      g.vk_f8 = 119;
      g.vk_f9 = 120;
      g.vk_f10 = 121;
      g.vk_f11 = 122;
      g.vk_f12 = 123;
      g.vk_numpad0 = 96;
      g.vk_numpad1 = 97;
      g.vk_numpad2 = 98;
      g.vk_numpad3 = 99;
      g.vk_numpad4 = 100;
      g.vk_numpad5 = 101;
      g.vk_numpad6 = 102;
      g.vk_numpad7 = 103;
      g.vk_numpad8 = 104;
      g.vk_numpad9 = 105;
      g.vk_multiply = 106;
      g.vk_divide = 111;
      g.vk_add = 107;
      g.vk_subtract = 109;
      g.vk_decimal = 110;
      g.vk_a = 65;
      g.vk_b = 66;
      g.vk_c = 67;
      g.vk_d = 68;
      g.vk_e = 69;
      g.vk_f = 70;
      g.vk_g = 71;
      g.vk_h = 72;
      g.vk_i = 73;
      g.vk_j = 74;
      g.vk_k = 75;
      g.vk_l = 76;
      g.vk_m = 77;
      g.vk_n = 78;
      g.vk_o = 79;
      g.vk_p = 80;
      g.vk_q = 81;
      g.vk_r = 82;
      g.vk_s = 83;
      g.vk_t = 84;
      g.vk_u = 85;
      g.vk_v = 86;
      g.vk_w = 87;
      g.vk_x = 88;
      g.vk_y = 89;
      g.vk_z = 90;
      g.mb_left = 0;
      g.mb_right = 2;
      g.mb_middle = 1;
    }
    /**
     * Register a game object class
     */
    registerObject(objectClass) {
      const instance = new objectClass();
      this.instanceManager.registerObjectClass(instance.objectType, objectClass);
    }
    /**
     * Load game configuration from game.json
     */
    async loadGameConfig(configPath) {
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`Failed to load game config: ${configPath}`);
      }
      const config = await response.json();
      if (config.sprites) {
        const basePath = this.config.assetsPath + "/sprites";
        for (const spriteName of config.sprites) {
          try {
            await this.spriteManager.loadSprite(basePath, spriteName);
          } catch (error) {
            console.warn(`Failed to load sprite: ${spriteName}`, error);
          }
        }
      }
      if (config.objects) {
        for (const objectPath of config.objects) {
        }
      }
      if (config.rooms) {
        for (const roomName of config.rooms) {
          await this.roomManager.loadRoomDefinition(this.config.assetsPath + "/rooms", roomName);
        }
      }
    }
    /**
     * Start the game
     */
    async start(startRoom) {
      if (this.running) {
        console.warn("Game is already running");
        return;
      }
      this.running = true;
      const roomToLoad = startRoom || this.config.startRoom;
      if (roomToLoad) {
        await this.roomManager.gotoRoom(roomToLoad);
      }
      if (!this.gameStarted) {
        const instances = this.instanceManager.getAllInstances();
        for (const instance of instances) {
          instance.gameStart();
        }
        this.gameStarted = true;
      }
      this.lastFrameTime = performance.now();
      this.gameLoop(this.lastFrameTime);
    }
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
      if (!this.running)
        return;
      const deltaTime = currentTime - this.lastFrameTime;
      if (deltaTime >= this.targetFrameTime) {
        this.update(deltaTime);
        this.render();
        this.lastFrameTime = currentTime - deltaTime % this.targetFrameTime;
      }
      this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    /**
     * Update game state
     */
    update(deltaTime) {
      this.instanceManager.updateInstances();
      this.updateViewFollowing();
      updateGlobalViewVariables(this);
      this.debugManager.update(deltaTime);
      this.keyboardManager.clearFrameStates();
      this.mouseManager.clearFrameStates();
    }
    /**
     * Update view to follow target object
     */
    updateViewFollowing() {
      const room = this.roomManager.getCurrentRoom();
      if (!room)
        return;
      const view = room.getView();
      if (!view.enabled || !view.object)
        return;
      const targets = this.instanceManager.getInstancesOfType(view.object);
      if (targets.length === 0)
        return;
      const target = targets[0];
      room.updateView(target.x, target.y);
    }
    /**
     * Render the game
     */
    render() {
      this.renderer.render();
    }
    /**
     * Stop the game
     */
    stop() {
      this.running = false;
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      const instances = this.instanceManager.getAllInstances();
      for (const instance of instances) {
        instance.gameEnd();
      }
    }
    /**
     * Restart the game
     */
    restart() {
      this.stop();
      this.instanceManager.clearAllInstances();
      this.gameStarted = false;
      this.start(this.config.startRoom);
    }
    /**
     * Check if debug mode is enabled
     */
    isDebugMode() {
      return this.debugManager.isEnabled();
    }
    // ===== Getters =====
    getConfig() {
      return this.config;
    }
    getInstanceManager() {
      return this.instanceManager;
    }
    getSpriteManager() {
      return this.spriteManager;
    }
    getKeyboardManager() {
      return this.keyboardManager;
    }
    getMouseManager() {
      return this.mouseManager;
    }
    getCollisionManager() {
      return this.collisionManager;
    }
    getRoomManager() {
      return this.roomManager;
    }
    getRenderer() {
      return this.renderer;
    }
    getSaveManager() {
      return this.saveManager;
    }
    getDebugManager() {
      return this.debugManager;
    }
  };

  // dist/data/objects/obj_player.js
  var obj_player = class extends GameObject {
    constructor() {
      super(...arguments);
      this.moveSpeed = 4;
      this.jumpSpeed = 12;
      this.gravity = 0.5;
      this.maxFallSpeed = 10;
      this.onGround = false;
    }
    create() {
      this.sprite_index = "spr_player";
    }
    step() {
      let hInput = 0;
      if (keyboard_check(globalThis.vk_a))
        hInput -= 1;
      if (keyboard_check(globalThis.vk_d))
        hInput += 1;
      this.hspeed = hInput * this.moveSpeed;
      if (this.hspeed !== 0 && this.place_meeting(this.x + this.hspeed, this.y, "obj_wall")) {
        const sign = Math.sign(this.hspeed);
        while (!this.place_meeting(this.x + sign, this.y, "obj_wall")) {
          this.x += sign;
        }
        this.hspeed = 0;
      }
      this.vspeed += this.gravity;
      if (this.vspeed > this.maxFallSpeed) {
        this.vspeed = this.maxFallSpeed;
      }
      this.onGround = this.place_meeting(this.x, this.y + 1, "obj_wall");
      if (this.onGround && keyboard_check_pressed(globalThis.vk_space)) {
        this.vspeed = -this.jumpSpeed;
      }
      if (this.vspeed !== 0 && this.place_meeting(this.x, this.y + this.vspeed, "obj_wall")) {
        const sign = Math.sign(this.vspeed);
        while (!this.place_meeting(this.x, this.y + sign, "obj_wall")) {
          this.y += sign;
        }
        this.vspeed = 0;
      }
      const collectible = this.instance_place(this.x, this.y, "obj_collectible");
      if (collectible && collectible.collect) {
        collectible.collect();
        console.log("Collected item!");
      }
    }
  };

  // dist/data/objects/obj_wall.js
  var obj_wall = class extends GameObject {
    create() {
      this.sprite_index = "spr_wall";
    }
  };

  // dist/data/objects/obj_collectible.js
  var obj_collectible = class extends GameObject {
    constructor() {
      super(...arguments);
      this.collected = false;
      this.respawnTimer = 0;
      this.respawnDelay = 180;
    }
    create() {
      this.sprite_index = "spr_collectible";
    }
    step() {
      if (!this.collected) {
        this.y = this.ystart + Math.sin(Date.now() / 200) * 4;
      } else {
        if (this.respawnTimer > 0) {
          this.respawnTimer--;
          if (this.respawnTimer === 0) {
            this.collected = false;
            this.visible = true;
          }
        }
      }
    }
    collect() {
      if (!this.collected) {
        this.collected = true;
        this.visible = false;
        this.respawnTimer = this.respawnDelay;
      }
    }
  };

  // dist/data/objects/obj_enemy.js
  var obj_enemy = class extends GameObject {
    constructor() {
      super(...arguments);
      this.moveSpeed = 1;
      this.gravity = 0.5;
      this.maxFallSpeed = 10;
      this.moveDirection = 1;
      this.directionTimer = 0;
      this.directionChangeTime = 180;
    }
    create() {
      this.sprite_index = "spr_enemy";
      this.directionTimer = this.directionChangeTime;
    }
    step() {
      this.hspeed = this.moveSpeed * this.moveDirection;
      if (this.hspeed !== 0 && this.place_meeting(this.x + this.hspeed, this.y, "obj_wall")) {
        const sign = Math.sign(this.hspeed);
        while (!this.place_meeting(this.x + sign, this.y, "obj_wall")) {
          this.x += sign;
        }
        this.hspeed = 0;
      }
      this.vspeed += this.gravity;
      if (this.vspeed > this.maxFallSpeed) {
        this.vspeed = this.maxFallSpeed;
      }
      if (this.vspeed !== 0 && this.place_meeting(this.x, this.y + this.vspeed, "obj_wall")) {
        const sign = Math.sign(this.vspeed);
        while (!this.place_meeting(this.x, this.y + sign, "obj_wall")) {
          this.y += sign;
        }
        this.vspeed = 0;
      }
      this.directionTimer--;
      if (this.directionTimer <= 0) {
        this.moveDirection *= -1;
        this.directionTimer = this.directionChangeTime;
      }
    }
  };

  // dist/src/main.js
  var canvas = document.getElementById("game-canvas");
  async function startGame() {
    try {
      const gameConfig = await fetch("./game.json").then((r) => r.json());
      const engine = new GameEngine({
        canvas,
        assetsPath: "./data",
        gameId: "Test game",
        startRoom: gameConfig.startRoom
      });
      engine.registerObject(obj_player);
      engine.registerObject(obj_wall);
      engine.registerObject(obj_collectible);
      engine.registerObject(obj_enemy);
      await engine.loadGameConfig("./game.json");
      await engine.start();
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  }
  startGame();
})();
