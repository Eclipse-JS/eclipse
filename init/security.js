const users = Kernel.extensions.get("users");
const hash = Kernel.extensions.get("hashcat");

// Implements virtual kernels.
console.log("Security: Preparing...");

Kernel.extensions.load("genkernel", async function generateCustomKernel(username) {
  console.log("Security: Making kernel for '" + username + "'...");

  let account = await users.parseUser(username);
  account.username = username;

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

        return Kernel.extensions.get(name, function(){ return account; });
      }
    },
    process: {
      create(funcStr) {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

        if (account.permLevel == 0) return AsyncFunction("argv", "Kernel", funcStr);
        return AsyncFunction("argv", "Kernel", "localStorage", "document", funcStr);
      },
      async spawn(name, func, argv) {
        return await Kernel.process.spawn(name, func, argv, newKernel);
      }
    },
    accounts: {
      async elevate(username, password) {
        let newProfile = await users.parseUser(username);
        newProfile.username = username;
  
        if (!newProfile) {
          throw "Invalid user";
        }
  
        if (account.permLevel == 0) {
          account = newProfile;
          return true;
        } else {
          const hash = await hash.sha512(password);
  
          if (hash == newProfile.hashedPassword) {
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
});