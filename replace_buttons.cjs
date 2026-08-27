const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  let newContent = content;
  
  // Replace button backgrounds
  newContent = newContent.replace(/bg-\[#C8A45D\] text-white/g, 'bg-[#0B1F3A] text-white');
  
  // Replace button hovers (excluding LuxuryButton.tsx just in case)
  if (!filePath.endsWith('LuxuryButton.tsx')) {
    newContent = newContent.replace(/hover:bg-\[#b5924d\]/g, 'hover:bg-[#08172b]');
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated buttons in:', filePath);
  }
}

function walk(dir) {
  let list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(file);
    }
  }
}

walk('./src');
console.log('Done fixing buttons');
