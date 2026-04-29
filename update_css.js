const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update Grid
css = css.replace(
  /grid-template-columns: repeat\(3, 1fr\) 320px;/g,
  'grid-template-columns: 1fr 320px;'
);

// 2. Macro track sizes
css = css.replace(
  /\.macro-track \{\s*height: 3px;/g,
  '.macro-track {\n    height: 8px;\n    border-radius: 4px;'
);
css = css.replace(
  /\.macro-fill \{\s*height: 100%;/g,
  '.macro-fill {\n    height: 100%;\n    border-radius: 4px;'
);

// 3. Remove text-transform: uppercase and extreme letter-spacing from specific classes

const classesToDeCaps = [
  '.brand-name',
  '.stat-eyebrow',
  '.ring-eyebrow',
  '.card-meta',
  '.macro-name',
  '.add-link',
  '.meal-name',
  '.accent-label',
];

for (const cls of classesToDeCaps) {
  const regex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*?)text-transform:\\s*uppercase;\\s*`, 'g');
  css = css.replace(regex, '$1');
  
  // Also reduce letter-spacing if it's large (e.g. .25em, .18em, .2em)
  const lsRegex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*?letter-spacing:)\\s*\\.[1-9][0-9]*em;`, 'g');
  css = css.replace(lsRegex, '$1 .02em;');
}

// Fix Sidebar nav-item
css = css.replace(
  /\.sidebar \.nav-item \{\n([^\}]*?)letter-spacing: \.15em; text-transform: uppercase;/g,
  '.sidebar .nav-item {\n$1letter-spacing: .02em;'
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated successfully');
