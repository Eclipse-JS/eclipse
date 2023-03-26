const input = await Kernel.extensions.get("input");
const VFS = await Kernel.extensions.get("Vfs");

const path = !argv[0] ? "/" : argv[0];

if (!(await VFS.exists(path, "folder"))) {
  input.stdout("Folder does not exist\n");
  return;
}

const contents = await VFS.readDir(path);
input.stdout(contents.map((i) => i.replace(path.endsWith("/") ? path : path + "/", "")).join(" ") + "\n");