const input = await Kernel.extensions.get("input");

const users = await Kernel.extensions.get("users");
const VFS = await Kernel.extensions.get("Vfs");

function ok() {
  input.stdout(" [OK]\n");
}

async function exec(path, args) {
  const file = await VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n"), args);
}

input.stdout("Welcome to EclipseOS! Please wait while I get things ready for you...\n");
input.stdout(" - Creating basic user accounts");

await users.addUser("nobody", ["nobody"], 1, "browhatrudoinglmao");

ok();

input.stdout(" - Initializing package manager\n\n");

await exec("/bin/pkg", ["init"]);

input.stdout("\n - Initializing...\n\n");
await exec("/bin/pkg", ["install", "dusk", "setup-gui"]);

try {
  await VFS.mkdir("/etc/sonnesvr");
} catch (e) {
  e.name = "DirectoryError";
  input.stdout(e.toString());
}

await VFS.write("/etc/sonnesvr/dusk.conf.json", JSON.stringify({
  autoStart: "/bin/setup-gui"
}));

input.stdout("$c:clear");
await exec("/bin/dusk", ["/bin/setup-gui"]);

return;