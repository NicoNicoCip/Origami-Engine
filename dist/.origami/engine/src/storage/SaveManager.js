/**
 * Manages game save/load functionality using localStorage
 */
export class SaveManager {
    constructor(gameId = 'default') {
        this.storagePrefix = 'origami_game_';
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
        }
        catch (error) {
            console.error('Failed to save game:', error);
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
        }
        catch (error) {
            console.error('Failed to load game:', error);
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
        }
        catch (error) {
            console.error('Failed to delete save:', error);
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
        }
        catch (error) {
            console.error('Failed to clear saves:', error);
            return false;
        }
    }
    /**
     * Get the storage key for a slot
     */
    getKey(slot) {
        return `${this.storagePrefix}${slot}`;
    }
}
/**
 * Initialize global save/load functions
 */
export function initializeSaveGlobals(saveManager) {
    const g = globalThis;
    g.game_save = function (slot) {
        // User should define what to save
        // This is just a simple example
        const saveData = {
            timestamp: Date.now(),
            // Add custom data here
        };
        return saveManager.save(slot, saveData);
    };
    g.game_load = function (slot) {
        const data = saveManager.load(slot);
        if (data === null) {
            return false;
        }
        // User should define how to load data
        // This is just a simple example
        return true;
    };
    g.game_save_exists = function (slot) {
        return saveManager.exists(slot);
    };
    g.game_save_delete = function (slot) {
        return saveManager.delete(slot);
    };
}
