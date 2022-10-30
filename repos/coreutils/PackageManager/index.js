qb.enableRegularRequire();

const args = argv;
const input = args.shift();

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("You must be root!\n");
  return;
}

const vfs = Kernel.extensions.get("Vfs");

require("./functions.js");

switch (args[0]) {
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

  case "ad-repo": {
    require("./repos/add.js")

    break;
  }

  case "install": {
    require("./packages/install.js")

    break;
  }
  
  default: {
    input.stdout("ERR: No commands specified!\n\n");
    help();
    
    break;
  }
}