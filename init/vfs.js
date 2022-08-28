function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "folder", name: "/"}]));
  return JSON.stringify([{type: "folder", name: "/"}]);
}

let fileSystem = !localStorage.getItem("vfs") ? wipeVFS() : localStorage.getItem("vfs");
fileSystem = JSON.parse(fileSystem);

VFS = {
  version() {
    return "gbvfs" // GarBage Virtual File System
  },
  read(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);

    const fileName = path.pop();
    const folders = "/" + path.join("/").slice(0, -1);

    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);

    if (!fileExists) {
      throw "File does not exist!";
    }

    return fileExists.contents;
  },
  write(rawPath, contents) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);

    const fileName = path.pop();
    const folders = "/" + path.join("/").slice(0, -1);

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);

    if (!folderExists) {
      throw "Folder does not exist!";
    }

    if (fileExists) {
      const index = fileSystem.indexOf(fileExists);
      fileSystem.slice(index, 1);
    }

    fileSystem.push({
      type: "file",
      name: fileName,
      directory: folders,
      contents: JSON.stringify(contents)
    });

    this.sync();
  },
  mkdir(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);
    const folders = "/" + path.join("/").slice(0, -1);

    // TODO: Add check for when the directory before the item does not exist

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);

    if (folderExists) {
      throw "Folder already exists!";
    }

    fileSystem.push({
      type: "directory",
      name: folders
    });

    this.sync();
  },
  readDir(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);
    const folders = "/" + path.join("/").slice(0, -1);

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);

    if (!folderExists) {
      throw "Folder does not exist!";
    }
    
    let matches = [];

    for (i of fileSystem) {
      if (i.directory == path) {
        matches.push(i.directory + "/" + i.name);
      }
    }
  },
  getType(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);

    const fileName = path.pop();
    const folders = "/" + path.join("/").slice(0, -1);

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);

    if (!folderExists && !fileExists) {
      throw "Item does not exist!";
    }

    return folderExists ? "folder" : "file";
  },
  existsSync(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);

    const fileName = path.pop();
    const folders = "/" + path.join("/").slice(0, -1);

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);
    
    return !folderExists || !fileExists;
  },
  sync() {
    localStorage.setItem("vfs", JSON.stringify(fileSystem));
  }
}
