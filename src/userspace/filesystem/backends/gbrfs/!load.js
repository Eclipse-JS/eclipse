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
    async read(rawPath) {
      gbrfsCompatCheck();

      require("./core/read.js")
    },
    async write(rawPath, contents) {
      gbrfsCompatCheck();

      require("./core/write.js")
    },
    async mkdir(rawPath) {
      gbrfsCompatCheck();

      require("./core/mkdir.js")
    },
    async readDir(rawPath) {
      gbrfsCompatCheck();

      require("./core/readDir.js")
    },
    async getType(rawPath) {
      gbrfsCompatCheck();
      
      require("./core/getType.js")
    },
    async exists(rawPath, fileOrFolder) {
      gbrfsCompatCheck();

      require("./core/existsSync.js")
    },
    sync() {
      localStorage.setItem("gbrfs", JSON.stringify(fileSystem));
    }
  }

  return gbrfs;
}