const users = Kernel.extensions.get("users");
const hash = Kernel.extensions.get("hashcat");

// Implements virtual kernels.
console.log("Security: Preparing...");

function genKernel(account) {
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
        await Kernel.process.spawn(name, func, argv, genKernel(account));
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
}

Kernel.extensions.load("genkernel", async function generateCustomKernel(username) {
  let account = await users.parseUser(username);
  account.username = username;

  return genKernel(account);
});