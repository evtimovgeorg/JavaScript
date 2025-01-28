const fs = require("fs");
console.log("JsonSaver.js loaded");
function SaveJsonToFile(json) {
  fs.writeFile("output.json", JSON.stringify(json), function (err) {
    if (err) {
      return err;
    } else {
      return "Json saved";
    }
  });
}
