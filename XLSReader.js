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
function ConvertDateToTimeStamp(date) {
  const TimeStamp = new Date(date);
  return TimeStamp.getTime();
}

function PopolateTable(data, newKeys) {
  var table = document.createElement("table");
  //var row = table.insertRow(-1);
  var THrow = document.createElement("tr");
  for (key in newKeys) {
    var cell = document.createElement("th");
    cell.textContent = newKeys[key];
    THrow.appendChild(cell);
  }
  table.appendChild(THrow);
  var alert = false;
  var warning = false;
  var error = false;

  for (dataIndex in data) {
    var row = document.createElement("tr");
    var classRow = "";
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
        classRow = "alert alert-warning";
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
        classRow = "alert alert-danger";
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
      var cell = document.createElement("td");
      cell.textContent = data[dataIndex][newKeys[key]];
      row.appendChild(cell);
    }
    row.className = classRow;
    table.appendChild(row);
    data[dataIndex].Date = ConvertDateToTimeStamp(data[dataIndex].Date);
  }
  table.className = "table table-striped";
  document.getElementById("outputTable").appendChild(table);
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
