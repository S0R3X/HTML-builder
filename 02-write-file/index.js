const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

stdout.write("Запись в файл\n");

const pathToText = path.join(__dirname, "text.txt");
let writeableStream = fs.createWriteStream(pathToText);
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") process.exit();
  writeableStream.write(data);
});

process.on("SIGINT", () => process.exit());
process.on("exit", () => stdout.write("Завершение программы!\n"));
