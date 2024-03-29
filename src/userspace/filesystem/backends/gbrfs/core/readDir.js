const path = rawPath.split("/").filter((word) => word.trim().length > 0);
const folders = "/" + path.join("/");

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);

if (folderExists.length == 0) {
  throw "Folder does not exist!";
}

let matches = [];

for (i of fileSystem) {
  if (i.type == "file" && i.directory == folders) {
    matches.push(i.directory + "/" + i.name);
  } else if (i.type == "directory" && i.prevDirectory == folders) {
    matches.push(i.name);
  }
}

return matches;