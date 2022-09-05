const args = argv;
const input = args.shift();

const VFS = Kernel.extensions.get("Vfs");

const path = !args[0] ? "/" : args[0];

if (!VFS.existsSync(path, "folder")) {
  input.stdout("Folder does not exist\n");
  return;
}

const contents = VFS.readDir(path);
input.stdout(contents.map((i) => i.replace(path.endsWith("/") ? path : path + "/", "")).join(" ") + "\n");