const path = rawPath.split("/").filter((word) => word.trim().length > 0);

const fileName = path.pop();
const folders = "/" + path.join("/");

const fileExists = fileSystem.filter(
  (d) => d.type == "file" && d.directory == folders && d.name == fileName
);

if (fileExists.length == 0) {
  throw "File does not exist!";
}

return fromBinary(atob(fileExists[0].contents));
