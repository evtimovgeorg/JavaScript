function SaveJsonToFile(json) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "output.json";
  a.click();
  URL.revokeObjectURL(url);
}
