const input = await Kernel.extensions.get("input");

const env = await Kernel.extensions.get("env");
const path = env.get("PATH");

const VFS = await Kernel.extensions.get("Vfs");
const net = await Kernel.extensions.get("libnet");

// Thanks, JavaScript, for not working in a sane way with async code!
async function findAsync(arr, func) {
  for await (const item of arr) {
    try {
      const data = await func(item);
      if (Boolean(data)) return item;

      continue;
    } catch (e) {
      continue;
    }
  }
}

while (true) {
  input.stdout(`${Kernel.accounts.getCurrentInfo().username}@${net.core.hostname.get()}$ `);
  const command = await input.stdin();

  if (command.trim() == "") continue;
  if (command.trim() == "exit") return;

  if (!command.startsWith("/")) {
    // Thanks JS!
    const validEnv = path.split(";");
    const validPathDirectory = await findAsync(validEnv, async(path) => await VFS.exists(path + command.split(" ")[0], "file"));

    if (!validPathDirectory) {
      input.stdout("error: No such file or directory.\n");
      continue;
    }

    const validPath = validPathDirectory + command.split(" ")[0];

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