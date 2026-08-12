const fs = require('fs');
const path = require('path');

const pathsToDelete = [
  '.vercel',
  'netlify',
  'api',
  'netlify.toml',
  'vercel.json'
];

pathsToDelete.forEach(item => {
  const fullPath = path.join(__dirname, item);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✅ Deleted: ${item}`);
  }
});

console.log('🎉 Cleanup complete! All Vercel and Netlify configurations have been permanently removed.');
