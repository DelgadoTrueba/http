//  node scripts/rename-files.js mjs
//  node scripts/rename-files.js cjs

const fs = require('fs');
const path = require('path');

// Args: 'cjs' or 'mjs'
const format = process.argv[2];
const sourceDir = path.join(__dirname, '..', `dist.${format}`);
const destDir = path.join(__dirname, '..', 'dist');
const suffix = format === 'cjs' ? '.cjs' : '.mjs';

const filesWithoutSuffix = [/^tsconfig$/];
function shouldOmitSuffix(fileName) {
  return filesWithoutSuffix.some((regex) => regex.test(fileName));
}

// Función para copiar archivos y carpetas a la carpeta 'dist'
function copyAndMoveFiles(srcDir, currentDestDir) {
  fs.readdirSync(srcDir).forEach((file) => {
    const sourcePath = path.join(srcDir, file);
    const stat = fs.lstatSync(sourcePath);

    if (stat.isFile()) {
      const [baseName, ...extArr] = file.split('.');

      ext = extArr.join('.');

      let newFileName;
      if (shouldOmitSuffix(file)) {
        newFileName = `${baseName}${ext}`;
      } else {
        newFileName = `${baseName}${suffix}.${ext}`;
      }

      const destPath = path.join(currentDestDir, newFileName);

      fs.copyFileSync(sourcePath, destPath);
    } else if (stat.isDirectory()) {
      // Si es una carpeta, crea el directorio sin modificar el nombre ni añadir sufijo
      const newDirPath = path.join(currentDestDir, file);

      if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath, { recursive: true });
      }

      // Recursivamente copiar el contenido de la carpeta
      copyAndMoveFiles(sourcePath, newDirPath);
    }
  });
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

copyAndMoveFiles(sourceDir, destDir);

fs.rmdirSync(sourceDir, { recursive: true });