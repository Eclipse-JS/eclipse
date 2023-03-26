const VFS = await Kernel.extensions.get("Vfs");

const hostnameExists = await VFS.exists("/etc/hostname", "file");
let hostname = hostnameExists ? await VFS.read("/etc/hostname") : "localhost";

async function extensionExists(name) {
  try {
    await Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}

if (!(await extensionExists("libnet"))) {
  Kernel.extensions.load("libnet", {
    async setHostname(name) {
      await VFS.write("/etc/hostname", name);
      hostname = name;
    },
    getHostname: () => hostname
  })
} else {
  const input = await Kernel.extensions.get("input");

  if (argv[0] == "set-hostname" && typeof argv[1] == "string") {
    await VFS.write("/etc/hostname", argv[1]);
    input.stdout(`Set hostname to '${argv[1]}'\n`);

    hostname = argv[1];
  }
}