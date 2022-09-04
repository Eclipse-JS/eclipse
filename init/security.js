const users = Kernel.extensions.get("users");
const hash = Kernel.extensions.get("hashcat");

// Implements virtual kernels.
console.log("Security: Preparing...");

const processTreeExtras = [];

function genKernel(localAccount) {
  let account = localAccount;

  function genFunc(funcRaw) {
    let allBanned = ["self"];
    let notElevatedBanned = ["localStorage", "document", "self"];

    const funcStr = typeof funcRaw != "string" ? funcRaw.toString() : funcRaw;
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  
    if (account.permLevel == 0) return AsyncFunction("argv", "Kernel", "pid", ...allBanned, funcStr);
    return AsyncFunction("argv", "Kernel", "pid", ...notElevatedBanned, ...allBanned, funcStr);
  }

  let newKernel = {
    extensions: {
      load(name, data, isGenFunction) {
        if (account.permLevel != 0) {
          throw "You must have permission level 0!";
        }

        return Kernel.extensions.load(name, data, isGenFunction);
      },
      get(name) {
        if (name == "genkernel") return;
        
        if (name == "users" && account.permLevel != 0) {
          const user = Kernel.extensions.get(name);

          return { parseUser: user.parseUser };
        }

        return Kernel.extensions.get(name, function(){ return account; });
      }
    },
    process: {
      create: (funcStr) => funcStr,
      getTree() {
        const tree = Kernel.process.getTree();
        let newTree = tree.map(i => {
          const filter = processTreeExtras.filter(j => j.id == i.id);

          if (filter.length == 0) {
            let newData = i;

            newData.userInfo = {
              "groups": [
                "root"
              ],
              "permLevel": "0",
              "hashedPassword": "2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9",
              "username": "root"
            }; // Dummy root user info

            return newData;
          }

          return filter[0];
        });

        return newTree;
      },
      async spawn(name, funcStr, argv) {
        const pid = Kernel.process.getPID(); // Hack to get pid
        const func = genFunc(funcStr);

        const item = {
          name: name,
          id: pid,
          userInfo: account
        };

        processTreeExtras.push(item);

        await Kernel.process.spawn(name, func, argv, genKernel(account));

        processTreeExtras.splice(processTreeExtras.indexOf(item), 1);
      }
    },
    accounts: {
      async elevate(username, password) {
        let newProfile = await users.parseUser(username);
  
        if (!newProfile) {
          return false;
        }

        newProfile.username = username;
  
        if (account.permLevel == 0) {
          account = newProfile;
          return true;
        } else {
          const hashed = await hash.sha512(password);
  
          if (hashed == newProfile.hashedPassword) {
            account = newProfile;
            return true;
          } else {
            return false;
          }
        }
      },
      getCurrentInfo() { return account; }
    },
    proxies: {
      addEventListener: function(...args) {
        return document.addEventListener(...args);
      }
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