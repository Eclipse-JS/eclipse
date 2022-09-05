qb.enableRegularRequire();

function fetchGbrfs(userData, load) {
  require("./gbrfs/libs/binaries.js")
  
  const gbrfsBackend = {
    version: () => "gbvfsR4",
    read(rawPath) {
      require("./gbrfs/read.js")
    },
    write(rawPath, contents) {
      require("./gbrfs/write.js")
    },
    mkdir(rawPath) {
      require("./gbrfs/mkdir.js")
    },
    readDir(rawPath) {
      require("./gbrfs/readDir.js")
    },
    getType(rawPath) {
      require("./gbrfs/getType.js")
    },
    existsSync(rawPath, fileOrFolder) {
      require("./gbrfs/existsSync.js")
    },
    sync() {
      localStorage.setItem("vfs", JSON.stringify(fileSystem));
    }
  }
  
  if (load && localStorage.getItem("vfs_ver") != gbrfsBackend.version()) {
    console.error("Incompatible version, wiping drive...");
    localStorage.clear();
    window.location.reload();
  }

  return gbrfsBackend;
}

const fsMap = [{name:"gbrfs", func:fetchGbrfs}];