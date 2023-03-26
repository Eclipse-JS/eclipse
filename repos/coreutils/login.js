const VFS = await Kernel.extensions.get("Vfs");
const input = await Kernel.extensions.get("input");
const kprint = await Kernel.extensions.get("kprint");

// De-escelate
kprint.log("TTY: Goodbye! De-escelating to 'nobody'...");
const attempt = await Kernel.accounts.elevate("nobody");

if (!attempt) {
  input.stdout("Failed to de-elevate for security! Aborting...\n");
  return;
}

if (await VFS.exists("/etc/motd", "file")) {
  const file = await VFS.read("/etc/motd");

  input.stdout(file);
}

input.stdout(`Welcome to ${Kernel.verInfo.displayVer}.\nThe build version is v${Kernel.verInfo.ver}.\n\n`);

let isCorrect = false;

while (!isCorrect) {
  input.stdout("Username: ");
  const username = await input.stdin();
  input.stdout("Password: ");
  const password = await input.stdin();
  
  const runEscalate = await Kernel.accounts.elevate(username, password);

  if (!runEscalate) {
    input.stdout("Invalid password!\n\n");
  } else {
    isCorrect = true;
  }
}

input.stdout("\n");

const binData = await VFS.read("/bin/sh");

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn("/bin/sh", process, []);