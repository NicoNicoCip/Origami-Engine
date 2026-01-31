import { Room } from './room.js';
/**
 * Manages rooms and room transitions
 */
export class RoomManager {
    constructor(engine) {
        this.rooms = new Map();
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
        // Call room end event on existing instances
        if (this.currentRoom) {
            const instances = this.engine.getInstanceManager().getAllInstances();
            for (const instance of instances) {
                if (!instance.persistent) {
                    instance.roomEnd();
                }
            }
            // Destroy non-persistent instances
            const instanceManager = this.engine.getInstanceManager();
            for (const instance of instances) {
                if (!instance.persistent) {
                    instanceManager.destroyInstance(instance);
                }
            }
        }
        // Load sprites needed for this room
        await this.preloadRoomAssets(definition);
        // Create new room
        this.currentRoom = new Room(definition);
        this.currentRoomDefinition = definition;
        // Update global room variables
        this.updateGlobalRoomVariables();
        // Create room instances
        await this.createRoomInstances(definition.instances);
        // Call room start event on all instances
        const instances = this.engine.getInstanceManager().getAllInstances();
        for (const instance of instances) {
            instance.roomStart();
        }
        // Resize canvas to fit the new room
        this.engine.getRenderer().resizeCanvas();
    }
    /**
     * Preload assets needed for the room
     */
    async preloadRoomAssets(definition) {
        const spriteManager = this.engine.getSpriteManager();
        const spritesToLoad = new Set();
        // For now, just preload common sprite names based on object names
        // A more robust solution would require knowing the sprite_index from the object definition
        for (const instance of definition.instances) {
            // Try to guess sprite name from object name (obj_player -> spr_player)
            const spriteName = instance.object.replace('obj_', 'spr_');
            spritesToLoad.add(spriteName);
        }
        // Load backgrounds
        if (definition.backgrounds) {
            for (const bg of definition.backgrounds) {
                if (bg.image) {
                    spritesToLoad.add(bg.image);
                }
            }
        }
        // Load all sprites
        const basePath = this.engine.getConfig().assetsPath + '/sprites';
        for (const spriteName of spritesToLoad) {
            try {
                await spriteManager.loadSprite(basePath, spriteName);
            }
            catch (error) {
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
                // Execute creation code if provided
                if (instanceDef.creationCode) {
                    try {
                        const func = new Function('instance', instanceDef.creationCode);
                        func(instance);
                    }
                    catch (error) {
                        console.error(`Error in creation code for ${instanceDef.object}:`, error);
                    }
                }
            }
            catch (error) {
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
}
