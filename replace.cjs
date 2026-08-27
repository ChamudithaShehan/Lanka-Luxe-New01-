const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/#1E7B9E/gi, '#C8A45D')
    .replace(/#156380/gi, '#b5924d')
    .replace(/#22A2BD/gi, '#C8A45D')
    .replace(/#1c8aa1/gi, '#b5924d');
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  let list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      replaceInFile(file);
    }
  }
}

walk('./src');
console.log('Done');
