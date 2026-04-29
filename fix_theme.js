const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client/src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace background: "#FFFFFF" or '#FFFFFF' with 'var(--card-bg)'
  content = content.replace(/background:\s*["']#FFFFFF["']/g, 'background: "var(--card-bg)"');
  
  // Replace color: "#FFFFFF" or '#FFFFFF' with 'var(--cream)'
  content = content.replace(/color:\s*["']#FFFFFF["']/g, 'color: "var(--cream)"');

  // Also replace some #f4f4f4 if any
  content = content.replace(/background:\s*["']#f4f4f4["']/g, 'background: "var(--ink-10)"');

  // Also fix border: "1px solid #FFFFFF" if any
  content = content.replace(/border:\s*["']1px solid #FFFFFF["']/g, 'border: "1px solid var(--border)"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
