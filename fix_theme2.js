const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client/src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace "#FFFFFF" with "var(--card-bg)"
  content = content.replace(/"#FFFFFF"/g, '"var(--card-bg)"');
  content = content.replace(/'#FFFFFF'/g, '"var(--card-bg)"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
