const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client/src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We remove textTransform: "uppercase" from things like eyebrows, etc.
  // But maybe leave it for small things? The user wants consistency. Let's just remove it entirely or leave it only on cta-btn (which uses CSS).
  // I'll regex it out entirely to be safe and clean.
  content = content.replace(/textTransform:\s*["']uppercase["'],?/g, '');
  
  // Replace large letterSpacing with .02em
  content = content.replace(/letterSpacing:\s*["'](0\.[1-9]\d*em)["']/g, 'letterSpacing: "0.02em"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
