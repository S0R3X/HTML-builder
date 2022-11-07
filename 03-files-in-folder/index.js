const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const pathToSecretFolder = path.join(__dirname, "secret-folder");
fs.readdir(pathToSecretFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const pathToFile = path.join(__dirname, "secret-folder", file);
    fs.lstat(pathToFile, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        stdout.write(path.basename(file, path.extname(file)) + " - ");
        stdout.write(path.extname(file).slice(1) + " - ");
        stdout.write(stats.size.toString() + " byte\n");
      }
    });
  });
});
