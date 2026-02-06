const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const srcViews = path.join(__dirname, '..', 'src', 'web', 'views');
const destViews = path.join(__dirname, '..', 'dist', 'web', 'views');
copyDir(srcViews, destViews);
console.log('Copied Pug views to dist.');
