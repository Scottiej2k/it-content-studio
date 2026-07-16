const fs = require('fs');
const path = require('path');

function searchForFile(dir, extension) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
         if (!['proc', 'sys', 'dev', 'node_modules', 'usr', 'lib', 'var', 'bin', 'sbin', 'boot', 'etc'].includes(entry.name)) {
            searchForFile(fullPath, extension);
         }
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        console.log(fullPath);
      }
    }
  } catch (e) {
    // Ignore permissions errors
  }
}

console.log("Searching for PDFs...");
searchForFile('/', '.pdf');
console.log("Searching for TXTs...");
searchForFile('/', 'raw_data');
