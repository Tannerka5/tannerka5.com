const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const outputPath = path.join(rootDir, 'lambda.zip');

if (!fs.existsSync(distDir)) {
  console.error('dist/ not found — run "npm run build" first.');
  process.exit(1);
}

// Install only production dependencies into a scratch directory so eslint/
// vitest/etc. (devDependencies) never end up bundled into the Lambda package.
const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lambda-package-'));
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(stagingDir, 'package.json'));
fs.copyFileSync(
  path.join(rootDir, 'package-lock.json'),
  path.join(stagingDir, 'package-lock.json')
);
console.log(`Installing production dependencies into ${stagingDir}...`);
execSync('npm ci --omit=dev --no-audit --no-fund', { cwd: stagingDir, stdio: 'inherit' });

const zip = new AdmZip();
zip.addLocalFolder(distDir);
zip.addLocalFolder(path.join(stagingDir, 'node_modules'), 'node_modules');
zip.writeZip(outputPath);

fs.rmSync(stagingDir, { recursive: true, force: true });

console.log(`lambda.zip created (${fs.statSync(outputPath).size} bytes)`);
