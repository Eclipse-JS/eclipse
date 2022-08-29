const args = argv;
const input = args.shift();

const path = !args[0] ? "/" : args[0];

if (!VFS.existsSync(path, "folder")) {
  input.stdout("Folder does not exist\n");
  return;
}

const contents = VFS.readDir(path);
input.stdout(contents.join(" ") + "\n");