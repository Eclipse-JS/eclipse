qb.enableRegularRequire();

const users = Kernel.extensions.get("users");
const hash = Kernel.extensions.get("hashcat");

// Implements virtual kernels.
console.log("Security: Preparing...");

const processTreeExtras = [];

function genKernel(localAccount) {
  let account = localAccount;

  require("./extras/genFunc.js");

  let newKernel = {
    extensions: {
      load(name, data, isGenFunction) {
        require("./extensions/load.js")
      },
      get(name) {
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
      addEventListener(...args) {
        if (account.permLevel != 0) {
          throw "No permission!";
        }

        document.addEventListener(...args);
      },
      removeEventListener(...args) {
        if (account.permLevel != 0) {
          throw "No permission!";
        }

        document.removeEventListener(...args);
      },
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