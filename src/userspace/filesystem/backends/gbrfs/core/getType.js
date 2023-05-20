const path = rawPath.split("/").filter((word) => word.trim().length > 0);

const fileName = path.pop();
const folders = "/" + path.join("/").slice(0, -1);

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);
const fileExists = fileSystem.filter(
  (d) => d.type == "file" && d.directory == folders && d.name == fileName
);

if (!folderExists && !fileExists) {
  throw "Item does not exist!";
}

return folderExists ? "folder" : "file";
