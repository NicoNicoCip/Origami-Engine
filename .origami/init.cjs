#!/usr/bin/env node
const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🎮 Origami Engine - Project Setup\n');

  try {
    // Get project details
    const projectName = await prompt('Project name (lowercase, no spaces): ');

    if (!projectName || /\s/.test(projectName)) {
      console.error('❌ Invalid project name. Must not contain spaces.');
      rl.close();
      process.exit(1);
    }

    const template = await prompt('Template (1=fresh, 2=platformer): ');
    const gameTitle = await prompt('Game title (display name): ');

    const templateName = template === '2' ? 'platformer' : 'fresh';
    const projectPath = path.join('..', projectName);

    console.log(`\n📦 Creating project "${gameTitle}" from ${templateName} template...\n`);

    // Clone template branch
    console.log('Cloning template...');
    execSync(
      `git clone -b template/${templateName} --depth 1 https://github.com/NicoNicoCip/Origami-Engine.git "${projectPath}"`,
      { stdio: 'inherit' }
    );

    // Remove .git folder (detach from template)
    const gitPath = path.join(projectPath, '.git');
    if (fs.existsSync(gitPath)) {
      fs.rmSync(gitPath, { recursive: true, force: true, maxRetries: 3 });
    }

    // Clone engine branch to temporary location
    console.log('\nFetching engine...');
    const tempEnginePath = path.join(projectPath, '.origami-temp');
    execSync(
      `git clone -b engine --depth 1 https://github.com/NicoNicoCip/Origami-Engine.git "${tempEnginePath}"`,
      { stdio: 'inherit' }
    );

    // Copy .origami folder from engine to project
    const engineOrigamiPath = path.join(tempEnginePath);
    const projectOrigamiPath = path.join(projectPath, '.origami');

    console.log('\nCopying engine files...');
    if (fs.existsSync(projectOrigamiPath)) {
      fs.rmSync(projectOrigamiPath, { recursive: true, force: true });
    }

    // Copy all engine files to .origami/ (excluding .git)
    copyRecursive(tempEnginePath, projectOrigamiPath, ['.git']);

    // Remove temp engine folder (with retry for Windows)
    try {
      fs.rmSync(tempEnginePath, { recursive: true, force: true, maxRetries: 3 });
    } catch (err) {
      // Fallback: try to remove .git first, then the whole folder
      try {
        const tempGitPath = path.join(tempEnginePath, '.git');
        if (fs.existsSync(tempGitPath)) {
          fs.rmSync(tempGitPath, { recursive: true, force: true, maxRetries: 3 });
        }
        fs.rmSync(tempEnginePath, { recursive: true, force: true, maxRetries: 3 });
      } catch (err2) {
        console.warn('⚠️  Could not remove temp folder, but engine was copied successfully.');
        console.warn('   You can manually delete:', tempEnginePath);
      }
    }

    // Substitute variables in template files
    console.log('\nConfiguring project...');
    const filesToUpdate = [
      'game.json',
      'package.json',
      'README.md',
      'src/main.ts'
    ];

    for (const file of filesToUpdate) {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
        content = content.replace(/\{\{GAME_TITLE\}\}/g, gameTitle);
        fs.writeFileSync(filePath, content);
      }
    }

    // Install dependencies
    console.log('\n📥 Installing dependencies...\n');
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    console.log(`\n✅ Project created successfully!\n`);
    console.log(`Next steps:`);
    console.log(`  cd ../${projectName}`);
    console.log(`  npm run dev       # Start development server`);
    console.log(`  npm run build     # Build for production\n`);

  } catch (error) {
    console.error('\n❌ Error creating project:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Helper function to copy directory recursively
function copyRecursive(src, dest, exclude = []) {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
