if (name == "genkernel") return;

if (name == "users" && account.permLevel != 0) {
  const user = Kernel.extensions.get(name);

  return { parseUser: user.parseUser };
} else if (name == "eventListener") {
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
} else if (name == "input") {
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
} else if (name == "env") {
  return envProvider;
}

return Kernel.extensions.get(name, function () {
  return account;
});
