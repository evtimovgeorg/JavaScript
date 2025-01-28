//const JSonSaver = require("SaveJsonToFile");
function SendErrorMessage(message) {
  console.log(message);
}
function SendWarningMessage(message) {
  console.log(message);
}
function SendAllertMessage(message) {
  console.log(message);
}
function PopolateTable(data, newKeys) {
  var table = document.getElementById("output");
  var row = table.insertRow(-1);
  var THrow = "<tr>";
  for (key in newKeys) {
    THrow += "<th>" + newKeys[key] + "</th>";
  }
  THrow += "</tr>";
  table.innerHTML += THrow;
  var alert = false;
  var warning = false;
  var error = false;

  for (dataIndex in data) {
    if (alert == true || warning == true || error == true) {
      row = "<tr class = 'alert alert-warning'>";
    } else {
      row = "<tr>";
    }
    for (var key in newKeys) {
      if (
        data[dataIndex][newKeys[key]] == undefined &&
        newKeys[key] != "Percepition"
      ) {
        if (error == false) {
          error = true;
          SendErrorMessage(
            "Error: The key " +
              newKeys[key] +
              " at " +
              data[dataIndex].Date +
              " has some undefined values"
          );
        }
      } else {
        error = false;
      }
      if (data[dataIndex].ThresholdH <= data[dataIndex].RiverLevel) {
        if (warning == false) {
          warning = true;
          SendWarningMessage(
            "Warning: The river level reach warning level(" +
              data[dataIndex].RiverLevel +
              ") at " +
              data[dataIndex].Date
          );
        }
      } else {
        warning = false;
      }
      if (data[dataIndex].ThresholdHH <= data[dataIndex].RiverLevel) {
        if (alert == false) {
          alert = true;
          SendAllertMessage(
            "Alert: The river level reach alert level(" +
              data[dataIndex].RiverLevel +
              ") at " +
              data[dataIndex].Date
          );
        }
      } else {
        alert = false;
      }

      row += "<td>" + data[dataIndex][newKeys[key]] + "</td>";
    }
    row += "</tr>";

    table.innerHTML += row;
  }
}
function JsonRenameKeys(json, oldKeys, newKeys) {
  for (oldKeysIndex = 0; oldKeysIndex < oldKeys.length; oldKeysIndex++) {
    for (jsonIndex = 0; jsonIndex < json.length; jsonIndex++) {
      json[jsonIndex][newKeys[oldKeysIndex]] =
        json[jsonIndex][oldKeys[oldKeysIndex]];
      delete json[jsonIndex][oldKeys[oldKeysIndex]];
    }
  }
}

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      console.log("The file has been read successfully.");
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      oldKeys = [
        "DateTime",
        "Livello da fondo del fiume [m]",
        "Precipitazione cumulata [mm]",
        "SogliaH",
        "SogliaHH",
      ];
      newKeys = [
        "Date",
        "RiverLevel",
        "Percepition",
        "ThresholdH",
        "ThresholdHH",
      ];
      JsonRenameKeys(jsonData, oldKeys, newKeys);
      PopolateTable(jsonData, newKeys);
      SaveJsonToFile(jsonData);
      console.log(jsonData);
    };
    reader.onerror = function (ex) {
      SendErrorMessage(ex + "Error reading the file");
    };
    reader.readAsArrayBuffer(file);
  });
