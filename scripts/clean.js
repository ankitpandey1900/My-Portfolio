/**
 * Project Build Cleanup Script
 * Cross-platform build output removal using Node.js filesystem APIs.
 */

const fs = require('fs');
const path = require('path');

const targetDirs = ['.next', 'out', 'build', 'node_modules/.cache'];
const targetFiles = ['tsconfig.tsbuildinfo'];

function clean() {
  console.log('Starting cleanup sequence...');

  targetDirs.forEach((dirName) => {
    const dirPath = path.join(__dirname, '..', dirName);
    if (fs.existsSync(dirPath)) {
      console.log(`Removing directory: ${dirName}`);
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });

  targetFiles.forEach((fileName) => {
    const filePath = path.join(__dirname, '..', fileName);
    if (fs.existsSync(filePath)) {
      console.log(`Removing file: ${fileName}`);
      fs.unlinkSync(filePath);
    }
  });

  console.log('Cleanup sequence completed successfully.');
}

clean();
