const path = rawPath.split("/").filter((word) => word.trim().length > 0);
const folders = "/" + path.join("/");

// TODO: Add check for when the directory before the item does not exist

const folderAlreadyExists = fileSystem.find(
  (d) => d.type == "directory" && d.name == folders
);

if (folderAlreadyExists) {
  throw "Folder already exists!";
}

const folderArr = path;
folderArr.pop();

const prevFolder = "/" + folderArr.join("/");

const prevFolderExists = fileSystem.find(
  (d) => d.type == "directory" && d.name == prevFolder
);

if (!prevFolderExists) {
  throw "Previous folder doesn't exist!"
}

fileSystem.push({
  type: "directory",
  prevDirectory: prevFolder,
  name: folders,
  owner: userData().username,
});

this.sync();
