/// <reference path="../.origami/engine/src/global.d.ts" />
import { GameEngine } from '../.origami/engine/src/index.js';

// Import your game objects here
// Example:
// import { obj_player } from '../data/objects/obj_player.js';

// Get canvas
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

// Load game config and start
async function startGame() {
    try {
        // Load game config first to get startRoom
        const gameConfig = await fetch('./game.json').then(r => r.json());

        // Create engine with dynamic startRoom from game.json
        const engine = new GameEngine({
            canvas,
            assetsPath: './data',
            gameId: 'test-fresh-game',
            startRoom: gameConfig.startRoom,
        });

        // Register game objects here
        // Example:
        // engine.registerObject(obj_player);

        await engine.loadGameConfig('./game.json');
        await engine.start();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

startGame();
