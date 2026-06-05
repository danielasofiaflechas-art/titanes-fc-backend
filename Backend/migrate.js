import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.js')) {
      callback(path.join(dir, f));
    }
  });
}

const resolveLocalImport = (dir, importPath) => {
  if (!importPath.startsWith('.')) return importPath;
  if (importPath.endsWith('.js')) return importPath;
  
  // check if it's a directory
  let fullPath = path.resolve(dir, importPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    return importPath + '/index.js';
  } else {
    return importPath + '.js';
  }
};

function migrateFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;
  let dir = path.dirname(filePath);

  // require('dotenv').config();
  code = code.replace(/require\(['"]dotenv['"]\)\.config\(\);?/g, "import dotenv from 'dotenv';\ndotenv.config();");

  // const { x, y } = require('module');
  code = code.replace(/(?:const|let|var)\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g, (match, vars, importPath) => {
    let resolvedPath = resolveLocalImport(dir, importPath);
    return `import { ${vars.trim()} } from '${resolvedPath}';`;
  });

  // const x = require('module');
  code = code.replace(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g, (match, varName, importPath) => {
    let resolvedPath = resolveLocalImport(dir, importPath);
    return `import ${varName} from '${resolvedPath}';`;
  });

  // module.exports = x;
  code = code.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, 'export default $1;');

  // module.exports = { x, y };
  code = code.replace(/module\.exports\s*=\s*\{([^}]+)\};?/g, 'export { $1 };');

  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Migrated ${filePath}`);
  }
}

// Run for index.js
migrateFile(path.resolve('c:/Users/Daniela/OneDrive/Escritorio/Titanes/backend/index.js'));

// Run for app
walkDir('c:/Users/Daniela/OneDrive/Escritorio/Titanes/backend/app', migrateFile);

console.log("Migration complete.");
