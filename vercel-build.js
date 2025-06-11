const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Run the build script
console.log('Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
  
  // Verify the build output
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    console.log('Build output found at:', distPath);
    console.log('Contents of dist directory:', fs.readdirSync(distPath));
  } else {
    console.error('Build output not found at:', distPath);
    process.exit(1);
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
