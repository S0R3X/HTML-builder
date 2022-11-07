const fs = require("fs");
const path = require("path");

const pathToStyles = path.join(__dirname, "styles");
const pathToBundle = path.join(__dirname, "project-dist", "bundle.css");

const createFileAsync = (pathToFile) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathToFile, "", (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const dataFromDirAsync = (pathToDir, extnameOfFiles) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDir, (err, files) => {
      if (err) reject(err);

      //Arr of path
      const arrOfPath = [];
      for (const file of files)
        if (path.extname(file) === extnameOfFiles) arrOfPath.push(file);

      //Arr of data
      const arrOfData = new Array(arrOfPath.length).fill("");
      let countStream = arrOfPath.length;

      for (let [index, file] of arrOfPath.entries()) {
        //Create stream
        let readableStream = fs.createReadStream(path.join(pathToDir, file));
        readableStream.on("data", (chunk) => (arrOfData[index] += chunk));

        //Stream end
        readableStream.on("end", () => {
          countStream--;
          if (countStream === 0) resolve(arrOfData);
        });
      }
    });
  });
};

const mergeStylesToFileAsync = async (pathToDir, pathToFile) => {
  const data = await dataFromDirAsync(pathToDir, ".css");
  return new Promise((resolve) => {
    let writeableStream = fs.createWriteStream(pathToFile);
    for (const value of data) writeableStream.write(value);
    resolve();
  });
};

createFileAsync(pathToBundle)
  .then(() => mergeStylesToFileAsync(pathToStyles, pathToBundle))
  .catch(() => console.log(err));;

module.exports = { createFileAsync, mergeStylesToFileAsync, dataFromDirAsync };
