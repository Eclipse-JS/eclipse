const path = rawPath.split("/").filter((word) => word.trim().length > 0);
const folders = "/" + path.join("/");

// TODO: Add check for when the directory before the item does not exist

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);

if (folderExists.length >= 1) {
  throw "Folder already exists!";
}

fileSystem.push({
  type: "directory",
  name: folders,
  owner: userData().username,
});

this.sync();
