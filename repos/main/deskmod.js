const VFS = await Kernel.extensions.get("Vfs");
const input = await Kernel.extensions.get("input");

switch (argv[0]) {
  default: {
    input.stdout("error: No arguments specified!\n");
    input.stdout("Avaliable options:\n");
    input.stdout(" - add-desktop-entry\n");

    break;
  }

  case "add-desktop-entry": {
    const path = argv[1];
    const name = argv[2];

    if (!path) return input.stdout("error: Missing path!\n");
    if (!name) return input.stdout("error: Missing name!\n");

    if (!(await VFS.exists(path, "file"))) return input.stdout("error: File specified does not exist!\n");
    if (!(await VFS.exists("/etc/sonnesvr/desktop", "folder"))) await VFS.mkdir("/etc/sonnesvr/desktop");

    await VFS.write(`/etc/sonnesvr/desktop/${name}.desktop.json`, JSON.stringify({
      path,
      name
    }));

    input.stdout("Done.\n");
  }
}