const users = Kernel.extensions.get("users");
const hash = Kernel.extensions.get("hashcat");

// Implements virtual kernels.
console.log("Security: Preparing...");

function genKernel(localAccount) {
  let account = localAccount;

  function genFunc(funcRaw) {
    let allBanned = ["self"];
    let notElevatedBanned = ["localStorage", "document", "self"];

    const funcStr = typeof funcRaw != "string" ? funcRaw.toString() : funcRaw;
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  
    if (account.permLevel == 0) return AsyncFunction("argv", "Kernel", ...allBanned, funcStr);
    return AsyncFunction("argv", "Kernel", ...notElevatedBanned, ...allBanned, funcStr);
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
      create(funcStr) {
        return funcStr;
      },
      async spawn(name, funcStr, argv) {
        const func = genFunc(funcStr);

        await Kernel.process.spawn(name, func, argv, genKernel(account));
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