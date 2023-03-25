const path = rawPath.split("/").filter((word) => word.trim().length > 0);

const fileName = fileOrFolder == "file" ? path.pop() : path; // This is not used anyway, just a stupid workaround
const folders = "/" + path.join("/");

const folderExists = fileSystem.filter(
  (d) => d.type == "directory" && d.name == folders
);
const fileExists = fileSystem.filter(
  (d) => d.type == "file" && d.directory == folders && d.name == fileName
);

return fileOrFolder == "file"
  ? fileExists.length != 0
  : folderExists.length != 0;
