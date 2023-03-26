const path = rawPath.split("/").filter((word) => word.trim().length > 0);

const fileName = path.pop();
const folders = "/" + path.join("/");

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);
const fileExists = fileSystem.filter(
  (d) => d.type == "file" && d.directory == folders && d.name == fileName
);

if (folderExists.length == 0) {
  throw "Folder does not exist!";
}

if (folderExists[0].owner != userData().username && userData().permLevel != 0) {
  throw "No permission!";
}

for (const i of fileExists) {
  if (i.owner != userData().username && userData().permLevel != 0) {
    throw "No permission!";
  }

  fileSystem.splice(fileSystem.indexOf(i), 1);
}

fileSystem.push({
  type: "file",
  name: fileName,
  directory: folders,
  contents: btoa(toBinary(contents)),
  owner: userData().username,
});

this.sync();
