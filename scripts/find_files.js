import fs from 'fs';
import path from 'path';

function findPdfs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findPdfs(fullPath);
    } else if (file.endsWith('.pdf') || file.endsWith('.txt')) {
      console.log(fullPath);
    }
  }
}
findPdfs(process.cwd());
