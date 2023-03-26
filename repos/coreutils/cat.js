const input = await Kernel.extensions.get("input");

const path = !argv[0] ? "/" : argv[0];
const VFS = await Kernel.extensions.get("Vfs");

if (!(await VFS.exists(path, "file"))) {
  input.stdout("File does not exist");
}

input.stdout(await VFS.read(path));