qb.enableRegularRequire();
const input = await Kernel.extensions.get("input");

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("You must be root!\n");
  return;
}

const vfs = await Kernel.extensions.get("Vfs");

require("./functions.js");

switch (argv[0]) {
  case "init": {
    require("./repos/init.js")
    
    break;
  }

  case "update-boot": {
    require("./packages/update-boot.js")

    break;
  }

  case "update": {
    require("./repos/update.js")
    
    break;
  }

  case "add-repo": {
    require("./repos/add.js")

    break;
  }

  case "search": {
    require("./repos/search.js")

    break;
  }

  case "install": {
    require("./packages/install.js")

    break;
  }

  case "fsu": {
    require("./packages/fsu.js")

    break;
  }
  
  default: {
    input.stdout("ERR: No commands specified!\n\n");
    help();
    
    break;
  }
}