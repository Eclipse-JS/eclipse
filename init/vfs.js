function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "directory", name: "/", owner: "root"}]));
  localStorage.setItem("vfs_ver", "gbvfsR4");
  return JSON.stringify([{type: "directory", name: "/"}]);
}

let fileSystem = !localStorage.getItem("vfs") ? wipeVFS() : localStorage.getItem("vfs");
fileSystem = JSON.parse(fileSystem);

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = '';
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

function fromBinary(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const charCodes = new Uint16Array(bytes.buffer);
  let result = '';
  for (let i = 0; i < charCodes.length; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

Kernel.extensions.load("Vfs", function(userData) {
  const VFS = {
    version() {
      return "gbvfsR4" // GarBage Virtual File System
    },
    read(rawPath) {
      const path = rawPath.split("/").filter(word => word.trim().length > 0);
  
      const fileName = path.pop();
      const folders = "/" + path.join("/");
  
      const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);
  
      if (fileExists.length == 0) {
        throw "File does not exist!";
      }
  
      return fromBinary(atob(fileExists[0].contents));
    },
    write(rawPath, contents) {
      const path = rawPath.split("/").filter(word => word.trim().length > 0);
  
      const fileName = path.pop();
      const folders = "/" + path.join("/");
  
      const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
      const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);
  
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

        fileSystem.splice(fileSystem.indexOf(i));
      }
  
      fileSystem.push({
        type: "file",
        name: fileName,
        directory: folders,
        contents: btoa(toBinary(contents)),
        owner: userData().username
      });
  
      this.sync();
    },
    mkdir(rawPath) {
      const path = rawPath.split("/").filter(word => word.trim().length > 0);
      const folders = "/" + path.join("/");
  
      // TODO: Add check for when the directory before the item does not exist
  
      const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
  
      if (folderExists.length >= 1) {
        throw "Folder already exists!";
      }
  
      fileSystem.push({
        type: "directory",
        name: folders,
        owner: userData().username
      });
  
      this.sync();
    },
    readDir(rawPath) {
      const path = rawPath.split("/").filter(word => word.trim().length > 0);
      const folders = "/" + path.join("/");
  
      const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
  
      if (folderExists.length == 0) {
        throw "Folder does not exist!";
      }
      
      let matches = [];
  
      for (i of fileSystem) {
        if (i.type == "file" && i.directory == folders) {
          matches.push(i.directory + "/" + i.name);
        }
      }
  
      return matches;
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
    existsSync(rawPath, fileOrFolder) {
      const path = rawPath.split("/").filter(word => word.trim().length > 0);
  
      const fileName = fileOrFolder == "file" ? path.pop() : path; // This is not used anyway, just a stupid workaround
      const folders = "/" + path.join("/");
  
      const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
      const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);
  
      return fileOrFolder == "file" ? fileExists.length != 0 : folderExists.length != 0;
    },
    sync() {
      localStorage.setItem("vfs", JSON.stringify(fileSystem));
    }
  };

  if (localStorage.getItem("vfs_ver") != VFS.version()) {
    console.error("Incompatible version, wiping drive...");
    localStorage.clear();
    window.location.reload();
  }

  return VFS;
}, true);