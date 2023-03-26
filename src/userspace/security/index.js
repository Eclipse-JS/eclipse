qb.enableRegularRequire();

const users = await Kernel.extensions.get("users");
const hash = await Kernel.extensions.get("hashcat");
const kprint = await Kernel.extensions.get("kprint");

// Implements virtual kernels.
kprint.log("Security: Preparing...");

const processTreeExtras = [];

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
        envArgs.splice(index, 1);
      }

      envArgs.push({
        name: arg,
        value: value
      });
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
    extensions: {
      load(name, data, isGenFunction) {
        require("./extensions/load.js")
      },
      async get(name) {
        require("./extensions/get.js")
      }
    },
    process: {
      create: (funcStr) => funcStr,
      getTree() {
        require("./process/getTree.js")
      },
      async spawn(name, funcStr, argv) {
        require("./process/spawn.js")
      }
    },
    accounts: {
      async elevate(username, password) {
        require("./accounts/elevate.js")
      },
      getCurrentInfo() { return account; }
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
      ver: "0.3.0",
      displayVer: "EclipseOS: Codename 'AntiSynchronous' (M-1 Build)",
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