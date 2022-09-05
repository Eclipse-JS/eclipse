const args = argv;
const input = args.shift();

const path = !args[0] ? "/" : args[0];
const VFS = Kernel.extensions.get("Vfs");

if (!VFS.existsSync(path, "file")) {
  input.stdout("File does not exist");
}

input.stdout(VFS.read(path));