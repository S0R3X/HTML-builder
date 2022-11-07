const fs = require("fs");
const path = require("path");

const pathToFiles = path.join(__dirname, "files");
const pathToCopyFiles = path.join(__dirname, "files-copy");

const mkdirAsync = async (pathToFile) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathToFile, { recursive: true }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const copyDirAsync = async (pathToOldDir, pathToNewDir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToOldDir, (err, files) => {
      if (err) reject(err);
      files.forEach((file) => {
        const pathToFile = path.join(pathToOldDir, file);
        fs.lstat(pathToFile, (err, stats) => {
          if (err) reject(err);
          if (stats.isFile()) {
            fs.copyFile(
              path.join(pathToOldDir, file),
              path.join(pathToNewDir, file),
              (err) => {
                if (err) reject(err);
              }
            );
          } else {
            mkdirAsync(path.join(pathToNewDir, file)).then(() =>
              copyDirAsync(pathToFile, path.join(pathToNewDir, file))
            );
          }
        });
      });
      resolve();
    });
  });
};

mkdirAsync(pathToCopyFiles)
  .then(() => copyDirAsync(pathToFiles, pathToCopyFiles))
  .catch((err) => console.log(err));

module.exports = { mkdirAsync, copyDirAsync };
