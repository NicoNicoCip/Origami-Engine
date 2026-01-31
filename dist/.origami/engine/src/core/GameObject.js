// Simple ID counter for game object instances
let gameObjectIdCounter = 0;
/**
 * Base class for all game objects in Origami Engine.
 * Extend this class and override methods like create(), step(), draw()
 * to define custom game object behavior.
 */
export class GameObject {
    constructor() {
        // Instance identification
        this.id = String(++gameObjectIdCounter);
        // Position and movement
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
        // Sprite and animation
        this.sprite_index = null;
        this.image_index = 0;
        this.image_speed = 1;
        this.image_alpha = 1;
        this.image_angle = 0;
        this.image_xscale = 1;
        this.image_yscale = 1;
        // Visibility and depth
        this.visible = true;
        this.depth = 0;
        // Execution order
        this.order = 0;
        // Flags
        this.persistent = false;
        this._destroyed = false;
        // Get the object type from the class name
        this.objectType = this.constructor.name;
    }
    /**
     * Called when the instance is created
     */
    create() { }
    /**
     * Called every frame to update game logic
     */
    step() { }
    /**
     * Called every frame to render the instance
     * Default implementation automatically draws the sprite
     */
    draw() {
        // Auto-draw sprite if sprite_index is set and draw() is not overridden
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
    gameStart() { }
    /**
     * Called when the game ends
     */
    gameEnd() { }
    /**
     * Called when entering a room
     */
    roomStart() { }
    /**
     * Called when leaving a room
     */
    roomEnd() { }
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
        // Store previous position
        this.xprevious = this.x;
        this.yprevious = this.y;
        // Update hspeed/vspeed from speed/direction
        if (this.speed !== 0) {
            const lengthdir_x = (len, dir) => len * Math.cos((dir * Math.PI) / 180);
            const lengthdir_y = (len, dir) => -len * Math.sin((dir * Math.PI) / 180);
            this.hspeed = lengthdir_x(this.speed, this.direction);
            this.vspeed = lengthdir_y(this.speed, this.direction);
        }
        // Apply motion
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
            // Get sprite frame count
            const sprite = this.engine.getSpriteManager().getSprite(this.sprite_index);
            if (sprite) {
                const frameCount = sprite.frames.length;
                // Loop animation
                if (this.image_index >= frameCount) {
                    this.image_index = this.image_index % frameCount;
                }
                else if (this.image_index < 0) {
                    this.image_index = (frameCount + (this.image_index % frameCount)) % frameCount;
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
}
