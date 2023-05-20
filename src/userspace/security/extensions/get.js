// I am literally big brother with all these proxying and handling lol
// Kinda stupid tbh but at least I have *some* protection against escelation exploits

switch (name) {
  default: {
    // What the *fuck*?
    // WHY is await called twice???
    // HUh?
    return await await Kernel.extensions.get(name, function () {
      return account;
    });    
  }

  case "genkernel": {
    return; // NO, do not EVER let the users EVER access genkernel.
    // Bad idea!
  }

  // Proxy to handle users code
  // Don't give them access to creating users -- extremely BIG and trivial escelation
  // exploit occurs.
  case "users": {
    if (account.permLevel != 0) {
      const user = await Kernel.extensions.get(name);

      return { parseUser: user.parseUser };
    } else { // Hacky approach to running code in default()?
      return await await Kernel.extensions.get(name, function () {
        return account;
      });
    }
  }

  // Handles event listener processing
  // TODO remove old approach in ../index.js
  case "eventListener": {
    return {
      addEventListener(...argv) {
        if (account.permLevel != 0) {
          throw "No permission!";
        }
  
        document.addEventListener(...argv);
      },
  
      removeEventListener(...argv) {
        if (account.permLevel != 0) {
          throw "No permission!";
        }
  
        document.addEventListener(...argv);
      }
    }
  }

  // Handles input processing
  // I don't know why this is in security, to be honest.
  // TODO?
  case "input": {
    function registerInput(obj) {
      if (obj && typeof obj == "object" && obj.stdin && obj.stdout) {
        inputProvider = obj;
        return true;
      }
  
      return false;
    }
  
    if (inputProvider.stdin && inputProvider.stdout) {
      let input = inputProvider;
      input.registerInput = registerInput;
  
      return input;
    }
  
    return { registerInput: registerInput };
  }

  // Handles ENV processing
  // See above comment
  // TODO
  case "env": {
    return envProvider;
  }
}