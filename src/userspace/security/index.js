qb.enableRegularRequire();

const users = await Kernel.extensions.get("users");
const hash = await Kernel.extensions.get("hashcat");
const kprint = await Kernel.extensions.get("kprint");

// Implements virtual kernels.
kprint.log("Security: Preparing...");

const processTreeExtras = [];

// This function is written by AI (tested and works well suprisingly)

// Bing AI/GPT4 Prompt:
// Write a JavaScript function to parse a string like this: 'test_0="string test" test_1=1 test_2 = "cool demo"' into an object like this: {"test_0": "string test", "test_1": 1, "test_2": "cool demo"}
function parseKernelParams(str) {
  const obj = {};
  const keyValuePairs = str.match(/([\w.]+)\s*=\s*("[^"]+"|\d+)/g);
  if (!keyValuePairs) return {};

  keyValuePairs.forEach((pair) => {
    let [key, value] = pair.split('=').map((s) => s.trim());
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else {
      value = parseInt(value);
    }
    
    obj[key] = value;
  });

  return obj;
}

const kernelParamsParsed = parseKernelParams(Kernel.params);

function validPidIsOnTree(pid) {
  if (!kernelParamsParsed["security.enablePidValidation"]) return true;

  const pidIndex = processTreeExtras.find((i) => i.id == pid);
  return Boolean(pidIndex);
}

function genKernel(localAccount, processTelementry, inputProviderDefault, envArgsDefault) {
  let account = localAccount;

  let envArgs = envArgsDefault && typeof envArgsDefault == "object" ? envArgsDefault : [];
  let inputProvider = inputProviderDefault && typeof inputProviderDefault == "object" ? inputProviderDefault : {};
  
  const envProvider = {
    get(arg) {
      if (envArgs.find(i => i.name == arg)) {
        const envVar = envArgs.find(i => i.name == arg);

        return envVar.value;
      } else {
        return undefined;
      } 
    },
    add(arg, value) {
      if (envArgs.find(i => i.name == arg)) {
        const index = envArgs.indexOf(envArgs.find(i => i.name == arg));
        envArgs.splice(index, 1, {
          name: arg,
          value: value
        });
      } else {
        envArgs.push({
          name: arg,
          value: value
        });
      }
    },
    remove(arg) {
      if (envArgs.find(i => i.name == arg)) {
        const index = envArgs.indexOf(envArgs.find(i => i.name == arg));
        envArgs.splice(index, 1);

        return true;
      }

      return false;
    }
  };

  require("./extras/genFunc.js");

  let newKernel = {
    params: Kernel.params,
    extensions: {
      load(name, data, isGenFunction) {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }
        
        require("./extensions/load.js")
      },
      async get(name) {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }

        require("./extensions/get.js")
      }
    },
    process: {
      create: (funcStr) => funcStr,
      getTree() {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }
        
        require("./process/getTree.js")
      },
      async spawn(name, funcStr, argv) {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }

        require("./process/spawn.js")
      }
    },
    accounts: {
      async elevate(username, password) {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }

        require("./accounts/elevate.js")
      },
      getCurrentInfo() {
        if (processTelementry) {
          if (!validPidIsOnTree(processTelementry.id)) throw new Error("Dead process is trying to do necromancy!");
        }

        return account; 
      }
    },
    proxies: {
      addEventListener(...argv) {
        if (typeof processTelementry == "object" && processTelementry.name && processTelementry.id) {
          console.warn("Security: Process name: %s with pid: %s is using the deprecated method of addEventListener! This will be removed.", 
                       processTelementry.name, processTelementry.id);
        }

        if (account.permLevel != 0) {
          throw "No permission!";
        }

        document.addEventListener(...argv);
      },
      removeEventListener(...argv) {
        if (typeof processTelementry == "object" && processTelementry.name && processTelementry.id) {
          console.warn("Security: Process name: %s with pid: %s is using the deprecated method of addEventListener! This will be removed.", 
                       processTelementry.name, processTelementry.id);
        }

        if (account.permLevel != 0) {
          throw "No permission!";
        }

        document.removeEventListener(...argv);
      },
    },
    verInfo: {
      ver: "0.4.0",
      displayVer: "EclipseOS 'Rebirth' (Milestone 2 beta)",
      isBeta: true
    }
  }

  newKernel.display = Kernel.display;
  return newKernel;
}

Kernel.extensions.load("genkernel", async function generateCustomKernel(username) {
  let account = await users.parseUser(username);
  account.username = username;

  return genKernel(account);
});