qb.enableRegularRequire();

const kprint = await Kernel.extensions.get("kprint");

// Libraries
require("./libs/getAllAsync.mjs");
require("./libs/splitFilePath.mjs");

// Basic file I/O
require("./read.mjs");
require("./write.mjs");

// Directory magic
require("./mkdir.mjs");
require("./readDir.mjs");

// Both need type validation.
// Then again everything does but who asked?
require("./existsSync.mjs");
require("./getType.mjs");

const ver = {
  core: "v0.1.0",
  eclipseBind: "v0.0.1"
}

const uniqueTrue = {
  unique: true
};

const uniqueFalse = {
  unique: false
}

function recursiveCallFail(failItem) {
  throw new Error("Attempted to call '" + failItem + "' twice!");
}

async function openDatabase(name, ver, onUpgradeNeeded) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, ver);
  
    req.addEventListener("upgradeneeded", async(e) => {
      await onUpgradeNeeded(e);

      return await openDatabase(name, ver, recursiveCallFail);
    });

    req.addEventListener("error", function(e) {
      reject(e);
    });

    req.addEventListener("success", () => {
      resolve(req.result);
    });
  })
};

class CloudaFS {
  constructor(fsPrefix, debugLogEnabled) {
    this.debugLog = debugLogEnabled ? true : false;
    this.path = fsPrefix + "_CloudaFS";
  }

  #ready = false;

  async init() {
    this.#debug("INIT: Opening Database...");
    this.db = await openDatabase(this.path, 1, (e) => {
      const db = e.target.result;

      if (e.oldVersion == 0) {
        this.#debug("INIT: Database inital configuration");

        const fsIndexStore = db.createObjectStore("indexes", { keyPath: "index" });
        fsIndexStore.createIndex("path", "path", uniqueTrue);
        fsIndexStore.createIndex("type", "type", uniqueFalse);
        fsIndexStore.createIndex("owner", "owner", uniqueFalse);

        const itemStore = db.createObjectStore("files", { keyPath: "index" });
        itemStore.createIndex("path", "path", uniqueTrue);
        itemStore.createIndex("contents", "contents", uniqueFalse);
      } else {
        this.#debug("ERR:", e.oldVersion);
        throw new Error("Unsupported version!");
      }
    });

    this.#debug("INIT: Begin: Completing transactions...")
    const fsData = this.db.transaction(["indexes", "files"], "readwrite");

    this.#debug("INIT: End: Setting object store data...");
    this.fsIndexes = fsData.objectStore("indexes");
    this.fsFiles = fsData.objectStore("files");

    this.#debug("INIT: Completed all tasks.");
    this.#ready = true;

    this.#debug("INIT: Validating EclipseOS compliance...");
    if (!(await this.exists("/", "folder"))) {
      this.#debug("INIT: Adding root directory!");
      await this.mkdir("/");
    };
    
    return true;
  }

  #renewTransactions() {
    const fsData = this.db.transaction(["indexes", "files"], "readwrite");

    this.fsIndexes = fsData.objectStore("indexes");
    this.fsFiles = fsData.objectStore("files");
  }

  #debug(...args) {
    if (this.debugLog) kprint.log("CloudaFS::" + args.join(" "));
  }

  version(returnAsJSON) {
    if (returnAsJSON) return ver;
    
    return `CloudaFS@'${ver.core}';binding='${ver.eclipseBind}'`;
  }

  async read(path) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await read(path, this.fsIndexes, this.fsFiles);
  }

  async write(path, contents) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await write(path, contents, this.fsIndexes, this.fsFiles);
  }

  async mkdir(path) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await mkdir(path, this.fsIndexes);
  }

  async readDir(path) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await readDir(path, this.fsIndexes);
  }

  async exists(path, typeOf) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await existsSync(path, typeOf, this.fsIndexes);
  }

  async getType(path) {
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }

    this.#renewTransactions();
    return await getType(path, this.fsIndexes);
  }

  async sync() { 
    if (!this.#ready) {
      throw new Error("Database not loaded");
    }
    
    return true; // Automatic sync go brrrrr
  }
}