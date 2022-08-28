function wipeVFS() {
  localStorage.setItem("vfs", JSON.stringify([{type: "folder", name: "/"}]));
  localStorage.setItem("vfs_ver", "gbvfsR2")
  return JSON.stringify([{type: "folder", name: "/"}]);
}

let fileSystem = !localStorage.getItem("vfs") ? wipeVFS() : localStorage.getItem("vfs");
fileSystem = JSON.parse(fileSystem);

// https://www.codegrepper.com/code-examples/javascript/string+to+hex+javascript
function hexToAscii(str1) {
	var hex  = str1.toString();
	var str = '';

	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}

	return str;
}

function asciiToHex(str) {
	var arr1 = [];

	for (var n = 0, l = str.length; n < l; n++) {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	}

	return arr1.join('');
}

VFS = {
  version() {
    return "gbvfsR2" // GarBage Virtual File System
  },
  read(rawPath) {
    const path = rawPath.split("/").filter(word => word.trim().length > 0);

    const fileName = path.pop();
    const folders = "/" + path.join("/");

    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);

    if (fileExists.length == 0) {
      throw "File does not exist!";
    }

    return hexToAscii(fileExists[0].contents);
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

    for (const i of fileExists) {
      fileSystem.splice(fileSystem.indexOf(i));
    }

    fileSystem.push({
      type: "file",
      name: fileName,
      directory: folders,
      contents: asciiToHex(JSON.stringify(contents))
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
      name: folders
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
    const folders = "/" + path.join("/");

    const folderExists = fileSystem.filter(d => d.type == "directory" && d.name == folders);
    const fileExists = fileSystem.filter(d => d.type == "file" && d.directory == folders && d.name == fileName);

    return folderExists.length != 0 || fileExists.length != 0;
  },
  sync() {
    localStorage.setItem("vfs", JSON.stringify(fileSystem));
  }
}

if (localStorage.getItem("vfs_ver") != VFS.version()) {
  console.error("Incompatible version, wiping drive...");
  localStorage.clear();
  window.location.reload();
}