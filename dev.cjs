#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.css': 'text/css',
};

console.log('Starting Origami Engine dev server...\n');

// Start TypeScript compiler in watch mode
console.log('Starting TypeScript compiler in watch mode...');
const tsc = spawn('npx', ['tsc', '--watch'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
});

// Give TypeScript time to do initial compilation
setTimeout(() => {
    // Load game.json to get port
    let port = 3000;
    try {
        const gameConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'game.json'), 'utf-8'));
        port = gameConfig.port || 3000;
    } catch {
        console.warn('Could not load game.json, using default port 3000');
    }

    const server = http.createServer((req, res) => {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = filePath.split('?')[0];

        // Serve compiled JS from dist/
        if (filePath.match(/^\/(src|objects)\/.+\.js$/)) {
            filePath = '/dist' + filePath;
        }

        const fullPath = path.join(process.cwd(), filePath);
        const ext = path.extname(filePath);
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(fullPath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(200, {
                    'Content-Type': mimeType,
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(content);
            }
        });
    });

    server.listen(port, () => {
        console.log(`\n✓ Dev server running at http://localhost:${port}`);
        console.log('  Press Ctrl+C to stop\n');
    });

    process.on('SIGINT', () => {
        tsc.kill();
        process.exit();
    });
}, 3000);
