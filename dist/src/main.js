/// <reference path="../.origami/engine/src/global.d.ts" />
import { GameEngine } from '../.origami/engine/src/index.js';
// Import game objects
import { obj_player } from '../data/objects/obj_player.js';
import { obj_wall } from '../data/objects/obj_wall.js';
import { obj_collectible } from '../data/objects/obj_collectible.js';
import { obj_enemy } from '../data/objects/obj_enemy.js';
// Get canvas
const canvas = document.getElementById('game-canvas');
// Load game config and start
async function startGame() {
    try {
        // Load game config first to get startRoom
        const gameConfig = await fetch('./game.json').then(r => r.json());
        // Create engine with dynamic startRoom from game.json
        const engine = new GameEngine({
            canvas,
            assetsPath: './data',
            gameId: 'Test game',
            startRoom: gameConfig.startRoom,
        });
        // Register game objects
        engine.registerObject(obj_player);
        engine.registerObject(obj_wall);
        engine.registerObject(obj_collectible);
        engine.registerObject(obj_enemy);
        await engine.loadGameConfig('./game.json');
        await engine.start();
    }
    catch (error) {
        console.error('Failed to start game:', error);
    }
}
startGame();
