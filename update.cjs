#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Origami Engine - Update Check\n');

try {
    // Check if we're in a game project (has .origami folder)
    const origamiPath = path.join(process.cwd(), '.origami');
    if (!fs.existsSync(origamiPath)) {
        console.error('X Not in an Origami Engine project.');
        console.error('   Run this command from your game project root directory.\n');
        process.exit(1);
    }

    // Get current version
    const currentVersion = '1.0.0'; // TODO: Read from .origami/package.json when implemented
    console.log(`Current version: ${currentVersion}`);

    // Get latest version from GitHub
    console.log('Checking for updates...\n');

    let latestVersion = '1.0.0';
    try {
        const tags = execSync(
            'git ls-remote --tags https://github.com/NicoNicoCip/Origami-Engine.git',
            { encoding: 'utf-8' }
        );

        const versions = tags
            .split('\n')
            .filter(line => line.includes('refs/tags/v'))
            .map(line => line.split('refs/tags/v')[1])
            .filter(v => v && /^\d+\.\d+\.\d+$/.test(v))
            .sort((a, b) => {
                const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
                const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
                if (aMajor !== bMajor) return bMajor - aMajor;
                if (aMinor !== bMinor) return bMinor - aMinor;
                return bPatch - aPatch;
            });

        if (versions.length > 0) {
            latestVersion = versions[0];
        }
    } catch (error) {
        console.warn('!!  Could not fetch latest version from GitHub.');
        console.warn('   Continuing with default version...\n');
    }

    console.log(`Latest version: ${latestVersion}`);

    if (currentVersion === latestVersion) {
        console.log('\nO Your engine is up to date!\n');
        process.exit(0);
    }

    console.log('\n!! Update available!\n');
    console.log('To update your engine:');
    console.log('1. Backup your project (git commit)');
    console.log('2. Run the following commands:\n');
    console.log('   # Create backup');
    console.log('   cp -r .origami .origami.backup');
    console.log('');
    console.log('   # Download latest engine');
    console.log('   git clone -b engine --depth 1 https://github.com/NicoNicoCip/Origami-Engine.git .origami-temp');
    console.log('');
    console.log('   # Replace engine folder');
    console.log('   rm -rf .origami');
    console.log('   mv .origami-temp .origami');
    console.log('   rm -rf .origami/.git');
    console.log('');
    console.log('3. Test your game to ensure compatibility');
    console.log('4. If issues occur, restore backup: mv .origami.backup .origami\n');
    console.log('Note: Your game code (data/, src/) will not be affected.\n');
    console.log('⚡ Automatic update coming in v0.2.0!\n');

} catch (error) {
    console.error('\nX Error checking for updates:', error.message);
    process.exit(1);
}
