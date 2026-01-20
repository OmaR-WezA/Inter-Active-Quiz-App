const fs = require('fs');

const content = fs.readFileSync('/lib/exam-data.ts', 'utf-8');
let idCounter = 1;

// Replace all "id: X," with incrementing ids
const updated = content.replace(/(\s+)id: \d+,/g, (match, indent) => {
  return `${indent}id: ${idCounter++},`;
});

fs.writeFileSync('/lib/exam-data.ts', updated, 'utf-8');
console.log(`✓ Updated ${idCounter - 1} question IDs to be globally unique!`);
