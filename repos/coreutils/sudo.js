const VFS = Kernel.extensions.get("Vfs");
const input = Kernel.extensions.get("input");
const env = Kernel.extensions.get("env");

if (argv.length == 0) {
  input.stdout("sudo: No commands specified.\n");
  return;
}

const path = env.get("PATH");
const rawCmd = argv.shift();

const validEnv = path.split(";");
const validCmdPath = validEnv.find(path => VFS.existsSync(path + rawCmd, "file"));

const cmd = rawCmd.startsWith("/") ? rawCmd : validCmdPath ? validCmdPath + rawCmd : new Error("Command not found.");

if (cmd instanceof Error) {
  input.stdout(`sudo: ${cmd.message}\n`);
  return;
}

const oldUsername = Kernel.accounts.getCurrentInfo().username;

const username = "root";
input.stdout(`sudo: Password for ${username}: `);
const password = await input.stdin();

const runEscalate = await Kernel.accounts.elevate(username, password);

if (!runEscalate) {
  input.stdout("sudo: Invalid password.\n");
  return;
}

try {
  const binData = VFS.read(cmd);

  const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
  await Kernel.process.spawn(i, process, argv);
} catch (e) {
  console.error(e);
}

await Kernel.accounts.elevate(oldUsername);