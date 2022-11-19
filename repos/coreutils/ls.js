const input = Kernel.extensions.get("input");
const VFS = Kernel.extensions.get("Vfs");

const path = !argv[0] ? "/" : argv[0];

if (!VFS.existsSync(path, "folder")) {
  input.stdout("Folder does not exist\n");
  return;
}

const contents = VFS.readDir(path);
input.stdout(contents.map((i) => i.replace(path.endsWith("/") ? path : path + "/", "")).join(" ") + "\n");