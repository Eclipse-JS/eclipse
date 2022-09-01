const VFS = Kernel.extensions.get("Vfs");

const args = argv;
const input = args.shift();

if (VFS.existsSync("/etc/motd", "file")) {
  const file = VFS.read("/etc/motd");

  input.stdout(file);
}

input.stdout("Welcome to EclipseOS! :3\nBuild: git\n\n");

let isCorrect = false;

while (!isCorrect) {
  input.stdout("Username: ");
  const username = await input.stdin();
  input.stdout("Passsword: ");
  const password = await input.stdin();
  
  const runEscalate = await Kernel.accounts.elevate(username, password);

  if (!runEscalate) {
    input.stdout("Invalid password!\n\n");
  } else {
    isCorrect = true;
  }
}

input.stdout("\n");

const binData = VFS.read("/bin/sh");

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(i, process, [input]);