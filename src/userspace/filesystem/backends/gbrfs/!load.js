qb.enableRegularRequire();
require("./core/libs/binaries.js");

const gbrfsVersion = "gbrfsR5";

function wipeGbrfs() {
  localStorage.setItem("gbrfs", JSON.stringify([{type: "directory", name: "/", owner: "root"}]));
  localStorage.setItem("gbrfs_ver", gbrfsVersion);
  return JSON.stringify([{type: "directory", name: "/"}]);
}

function gbrfsCompatCheck() {
  if (localStorage.getItem("gbrfs_ver") != gbrfsVersion) {
    console.error("Incompatible version, wiping drive...");

    localStorage.setItem("old_gbrfs", localStorage.getItem("gbrfs"));
    localStorage.removeItem("gbrfs");

    window.location.reload();
  }
}

function loadGbrfs(userData) {
  const fileSystem = JSON.parse(
    localStorage.getItem("gbrfs") ? localStorage.getItem("gbrfs") : wipeGbrfs()
  );

  const gbrfs = {
    version: () => localStorage.getItem("gbrfs_ver"),
    read(rawPath) {
      gbrfsCompatCheck();

      require("./core/read.js")
    },
    write(rawPath, contents) {
      gbrfsCompatCheck();

      require("./core/write.js")
    },
    mkdir(rawPath) {
      gbrfsCompatCheck();

      require("./core/mkdir.js")
    },
    readDir(rawPath) {
      gbrfsCompatCheck();

      require("./core/readDir.js")
    },
    getType(rawPath) {
      gbrfsCompatCheck();
      
      require("./core/getType.js")
    },
    exists(rawPath, fileOrFolder) {
      gbrfsCompatCheck();

      require("./core/existsSync.js")
    },
    sync() {
      localStorage.setItem("gbrfs", JSON.stringify(fileSystem));
    }
  }

  return gbrfs;
}