const input = Kernel.extensions.get("input");

const env = Kernel.extensions.get("env");
const path = env.get("PATH");

const VFS = Kernel.extensions.get("Vfs");
const net = Kernel.extensions.get("libnet");

while (true) {
  input.stdout(`${Kernel.accounts.getCurrentInfo().username}@${net.getHostname()}$ `);
  const command = await input.stdin();

  if (command.trim() == "") continue;
  if (command.trim() == "exit") return;

  if (!command.startsWith("/")) {
    const validEnv = path.split(";");
    let validPath = validEnv.filter(async(path) => await VFS.exists(path + command.split(" ")[0], "file"));

    if (validPath.length == 0) {
      input.stdout("error: No such file or directory.\n");
      continue;
    }

    validPath += command.split(" ")[0];

    try {
      const binData = await VFS.read(validPath);

      const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
      await Kernel.process.spawn(validPath, process, command.split(" ").slice(1));
    } catch (e) {
      console.error(e);
      input.stdout(command.split(" ")[0] + ": Exception raised.\n");
    }
  } else {
    if (!(await VFS.exists(command.split(" ")[0], "file"))) {
      input.stdout("error: No such file or directory.\n");
      continue;
    }

    try {
      const binData = await VFS.read(command.split(" ")[0]);

      const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
      await Kernel.process.spawn(command.split(" ")[0], process, command.split(" ").slice(1));
    } catch (e) {
      console.error(e);
      input.stdout(command.split(" ")[0] + ": Exception raised.\n");
    }
  }
}