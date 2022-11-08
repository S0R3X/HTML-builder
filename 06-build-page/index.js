const fs = require("fs");
const path = require("path");
const {
  createFileAsync,
  mergeStylesToFileAsync,
  dataFromDirAsync,
} = require("../05-merge-styles/index");
const { mkdirAsync, copyDirAsync } = require("../04-copy-directory/index");

const pathToProjectDist = path.join(__dirname, "project-dist");
const pathToComponents = path.join(__dirname, "components");
const pathToProjectDistIndex = path.join(pathToProjectDist, "index.html");
const pathToProjectDistStyle = path.join(pathToProjectDist, "style.css");
const pathToTemplate = path.join(__dirname, "template.html");
const pathToStyles = path.join(__dirname, "styles");
const pathToAssets = path.join(__dirname, "assets");
const pathToProjectDistAssets = path.join(pathToProjectDist, "assets");

const dataFromFile = async (pathToFile) => {
  return new Promise((resolve) => {
    let readableStream = fs.createReadStream(pathToFile);
    let data = "";
    readableStream.on("data", (chuck) => (data += chuck));
    readableStream.on("end", () => resolve(data));
  });
};

const dataСonnection = async (dir, arrDataDir, dataFile) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      for (const [index, file] of files.entries()) {
        const fileName = path.basename(file, path.extname(file));
        dataFile = dataFile.replace(`{{${fileName}}}`, arrDataDir[index]);
      }
      resolve(dataFile);
    });
  });
};

const createFiniteHtml = async (mainFile, componets, finiteFile) => {
  const arrDataComponents = await dataFromDirAsync(componets, ".html");
  const dataMainFile = await dataFromFile(mainFile);
  const finalData = await dataСonnection(
    componets,
    arrDataComponents,
    dataMainFile
  );
  return new Promise((resolve) => {
    let writeableStream = fs.createWriteStream(finiteFile);
    writeableStream.write(finalData);
    resolve();
  });
};

mkdirAsync(pathToProjectDist)
  .then(() => createFileAsync(pathToProjectDistIndex))
  .then(() =>
    createFiniteHtml(pathToTemplate, pathToComponents, pathToProjectDistIndex)
  )
  .then(() => createFileAsync(pathToProjectDistStyle))
  .then(() => mergeStylesToFileAsync(pathToStyles, pathToProjectDistStyle))
  .then(() => mkdirAsync(pathToProjectDistAssets))
  .then(() => copyDirAsync(pathToAssets, pathToProjectDistAssets))
  .catch(() => console.log(err));
