const path = rawPath.split("/").filter((word) => word.trim().length > 0);
const folders = "/" + path.join("/");

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);

if (folderExists.length == 0) {
  throw "Folder does not exist!";
}

let matches = [];

for (const i of fileSystem) {
  if (i.type == "file" && i.directory == folders) {
    matches.push(i.directory + "/" + i.name);
  }
}

return matches;