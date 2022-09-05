const VFS = Kernel.extensions.get("Vfs");

const args = argv;
const input = args.shift();

const cmd = args.shift();

const oldUsername = Kernel.accounts.getCurrentInfo().username;

const username = "root";
input.stdout(`sudo: Passsword for ${username}: `);
const password = await input.stdin();

const runEscalate = await Kernel.accounts.elevate(username, password);

if (!runEscalate) {
  input.stdout("sudo: Invalid password.\n");
  return;
}

try {
  const binData = VFS.read(cmd);

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn(i, process, [input, ...args]);
} catch (e) {
  console.error(e);
}

await Kernel.accounts.elevate(oldUsername);