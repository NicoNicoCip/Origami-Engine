#!/usr/build/env node
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

console.log('Building standalone bundle...\n');

// Ensure build directory exists and TypeScript is compiled
const { execSync } = require('child_process');
console.log('Compiling TypeScript...');
execSync('npx tsc', { cwd: process.cwd(), stdio: 'inherit' });

console.log('Inlining JSON data...');

// Read game.json
const gameJson = JSON.parse(fs.readFileSync('game.json', 'utf-8'));

// Read all room JSON files
const roomsData = {};
for (const roomName of gameJson.rooms) {
    const roomPath = path.join('data', 'rooms', `${roomName}.json`);
    if (fs.existsSync(roomPath)) {
        roomsData[roomName] = JSON.parse(fs.readFileSync(roomPath, 'utf-8'));
    }
}

console.log('Inlining sprite data...');

// Read all sprite metadata and images
const spritesData = {};
if (gameJson.sprites && Array.isArray(gameJson.sprites)) {
    for (const spriteName of gameJson.sprites) {
        const spriteDir = path.join('data', 'sprites', spriteName);
        if (!fs.existsSync(spriteDir)) continue;

        const metadataPath = path.join(spriteDir, 'metadata.json');
        if (!fs.existsSync(metadataPath)) continue;

        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        const frames = [];

        // Load all frame images as base64
        const frameCount = metadata.frames || 1;
        for (let i = 0; i < frameCount; i++) {
            const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
            let frameLoaded = false;

            for (const ext of extensions) {
                const framePath = path.join(spriteDir, `frame_${i}${ext}`);
                if (fs.existsSync(framePath)) {
                    const imageBuffer = fs.readFileSync(framePath);
                    const base64 = imageBuffer.toString('base64');
                    const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                    frames.push(`data:${mimeType};base64,${base64}`);
                    frameLoaded = true;
                    break;
                }
            }

            if (!frameLoaded && i === 0) {
                console.warn(`Warning: No frame 0 found for sprite ${spriteName}`);
            }
        }

        spritesData[spriteName] = {
            metadata: metadata,
            frames: frames
        };
    }
}

console.log('Inlining background data...');

// Read all background images
const backgroundsData = {};
if (gameJson.backgrounds && Array.isArray(gameJson.backgrounds)) {
    for (const bgName of gameJson.backgrounds) {
        const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
        for (const ext of extensions) {
            const bgPath = path.join('data', 'backgrounds', `${bgName}${ext}`);
            if (fs.existsSync(bgPath)) {
                const imageBuffer = fs.readFileSync(bgPath);
                const base64 = imageBuffer.toString('base64');
                const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                backgroundsData[bgName] = `data:${mimeType};base64,${base64}`;
                break;
            }
        }
    }
}

console.log('Inlining sound data...');

// Read all sound files
const soundsData = {};
if (gameJson.sounds && Array.isArray(gameJson.sounds)) {
    for (const soundName of gameJson.sounds) {
        const extensions = ['.mp3', '.ogg', '.wav', '.m4a'];
        for (const ext of extensions) {
            const soundPath = path.join('data', 'sounds', `${soundName}${ext}`);
            if (fs.existsSync(soundPath)) {
                const audioBuffer = fs.readFileSync(soundPath);
                const base64 = audioBuffer.toString('base64');
                const mimeType = ext === '.mp3' ? 'audio/mpeg' : ext === '.ogg' ? 'audio/ogg' : ext === '.wav' ? 'audio/wav' : 'audio/mp4';
                soundsData[soundName] = `data:${mimeType};base64,${base64}`;
                break;
            }
        }
    }
}

console.log('Inlining font data...');

// Read all font files
const fontsData = {};
if (gameJson.fonts && Array.isArray(gameJson.fonts)) {
    for (const fontName of gameJson.fonts) {
        const extensions = ['.ttf', '.otf', '.woff', '.woff2'];
        for (const ext of extensions) {
            const fontPath = path.join('data', 'fonts', `${fontName}${ext}`);
            if (fs.existsSync(fontPath)) {
                const fontBuffer = fs.readFileSync(fontPath);
                const base64 = fontBuffer.toString('base64');
                const mimeType = ext === '.woff2' ? 'font/woff2' : ext === '.woff' ? 'font/woff' : ext === '.otf' ? 'font/otf' : 'font/ttf';
                fontsData[fontName] = `data:${mimeType};base64,${base64}`;
                break;
            }
        }
    }
}

console.log('Inlining script data...');

// Read all script JSON files
const scriptsData = {};
if (gameJson.scripts && Array.isArray(gameJson.scripts)) {
    for (const scriptName of gameJson.scripts) {
        const scriptPath = path.join('data', 'scripts', `${scriptName}.json`);
        if (fs.existsSync(scriptPath)) {
            scriptsData[scriptName] = JSON.parse(fs.readFileSync(scriptPath, 'utf-8'));
        }
    }
}

console.log('Inlining path data...');

// Read all path JSON files
const pathsData = {};
if (gameJson.paths && Array.isArray(gameJson.paths)) {
    for (const pathName of gameJson.paths) {
        const pathPath = path.join('data', 'paths', `${pathName}.json`);
        if (fs.existsSync(pathPath)) {
            pathsData[pathName] = JSON.parse(fs.readFileSync(pathPath, 'utf-8'));
        }
    }
}

console.log('Inlining timeline data...');

// Read all timeline JSON files
const timelinesData = {};
if (gameJson.timelines && Array.isArray(gameJson.timelines)) {
    for (const timelineName of gameJson.timelines) {
        const timelinePath = path.join('data', 'timelines', `${timelineName}.json`);
        if (fs.existsSync(timelinePath)) {
            timelinesData[timelineName] = JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));
        }
    }
}

console.log('Inlining shader data...');

// Read all shader files
const shadersData = {};
if (gameJson.shaders && Array.isArray(gameJson.shaders)) {
    for (const shaderName of gameJson.shaders) {
        const vertPath = path.join('data', 'shaders', `${shaderName}.vert`);
        const fragPath = path.join('data', 'shaders', `${shaderName}.frag`);

        if (fs.existsSync(vertPath) && fs.existsSync(fragPath)) {
            shadersData[shaderName] = {
                vertex: fs.readFileSync(vertPath, 'utf-8'),
                fragment: fs.readFileSync(fragPath, 'utf-8')
            };
        }
    }
}

// Create a wrapper that injects the data
const dataInjectionCode = `
// Inlined game data
window.__GAME_DATA__ = ${JSON.stringify(gameJson)};
window.__ROOMS_DATA__ = ${JSON.stringify(roomsData)};
window.__SPRITES_DATA__ = ${JSON.stringify(spritesData)};
window.__BACKGROUNDS_DATA__ = ${JSON.stringify(backgroundsData)};
window.__SOUNDS_DATA__ = ${JSON.stringify(soundsData)};
window.__FONTS_DATA__ = ${JSON.stringify(fontsData)};
window.__SCRIPTS_DATA__ = ${JSON.stringify(scriptsData)};
window.__PATHS_DATA__ = ${JSON.stringify(pathsData)};
window.__TIMELINES_DATA__ = ${JSON.stringify(timelinesData)};
window.__SHADERS_DATA__ = ${JSON.stringify(shadersData)};

// Override fetch to return inlined data
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    // Normalize URL
    const normalizedUrl = url.replace(/^\\.\\//, '').replace(/\\\\/g, '/');

    if (normalizedUrl === 'game.json' || normalizedUrl.endsWith('/game.json')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(window.__GAME_DATA__)
        });
    }

    // Check for room JSON files
    const roomMatch = normalizedUrl.match(/rooms\\/([^/]+)\\.json$/);
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
    const spriteMetadataMatch = normalizedUrl.match(/sprites\\/([^/]+)\\/metadata\\.json$/);
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
    const spriteFrameMatch = normalizedUrl.match(/sprites\\/([^/]+)\\/frame_(\\d+)\\.(png|jpg|jpeg|webp)$/);
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
    const backgroundMatch = normalizedUrl.match(/backgrounds\\/([^/]+)\\.(png|jpg|jpeg|webp)$/);
    if (backgroundMatch) {
        const bgName = backgroundMatch[1];
        if (window.__BACKGROUNDS_DATA__[bgName]) {
            return fetch(window.__BACKGROUNDS_DATA__[bgName]);
        }
    }

    // Check for sound files
    const soundMatch = normalizedUrl.match(/sounds\\/([^/]+)\\.(mp3|ogg|wav|m4a)$/);
    if (soundMatch) {
        const soundName = soundMatch[1];
        if (window.__SOUNDS_DATA__[soundName]) {
            return fetch(window.__SOUNDS_DATA__[soundName]);
        }
    }

    // Check for font files
    const fontMatch = normalizedUrl.match(/fonts\\/([^/]+)\\.(ttf|otf|woff|woff2)$/);
    if (fontMatch) {
        const fontName = fontMatch[1];
        if (window.__FONTS_DATA__[fontName]) {
            return fetch(window.__FONTS_DATA__[fontName]);
        }
    }

    // Check for script JSON files
    const scriptMatch = normalizedUrl.match(/scripts\\/([^/]+)\\.json$/);
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
    const pathMatch = normalizedUrl.match(/paths\\/([^/]+)\\.json$/);
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
    const timelineMatch = normalizedUrl.match(/timelines\\/([^/]+)\\.json$/);
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
    const shaderVertMatch = normalizedUrl.match(/shaders\\/([^/]+)\\.vert$/);
    if (shaderVertMatch) {
        const shaderName = shaderVertMatch[1];
        if (window.__SHADERS_DATA__[shaderName]) {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(window.__SHADERS_DATA__[shaderName].vertex)
            });
        }
    }

    const shaderFragMatch = normalizedUrl.match(/shaders\\/([^/]+)\\.frag$/);
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
`;

// Ensure build directory exists
if (!fs.existsSync('build')) {
    fs.mkdirSync('build', { recursive: true });
}

// Bundle with esbuild
esbuild.build({
    entryPoints: ['dist/src/main.js'],
    bundle: true,
    outfile: 'build/game.js',
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    sourcemap: false,
    minify: false,
    banner: {
        js: dataInjectionCode
    }
}).then(() => {
    console.log('\nO Standalone bundle created at build/game.js');
    console.log('O Game and room data inlined');
    console.log(`O Sprites inlined: ${Object.keys(spritesData).length}`);
    console.log(`O Backgrounds inlined: ${Object.keys(backgroundsData).length}`);
    console.log(`O Sounds inlined: ${Object.keys(soundsData).length}`);
    console.log(`O Fonts inlined: ${Object.keys(fontsData).length}`);
    console.log(`O Scripts inlined: ${Object.keys(scriptsData).length}`);
    console.log(`O Paths inlined: ${Object.keys(pathsData).length}`);
    console.log(`O Timelines inlined: ${Object.keys(timelinesData).length}`);
    console.log(`O Shaders inlined: ${Object.keys(shadersData).length}`);
    console.log('\nYou can now open index.html directly in your browser!\n');
}).catch((error) => {
    console.error('X Build failed:', error);
    process.exit(1);
});
