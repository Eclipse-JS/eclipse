qb.enableRegularRequire();

console.log("INFO: Bringing up security, vfs, and ttysh (for console)...")

document.title = "TEST::EclipseOS";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

async function execJS(name, path) {
  const data = await read(path);

  const processData = Kernel.process.create(data);
  await Kernel.process.spawn(name, processData); 
}

await execJS("hashcat", "init/hashcat.js");
await execJS("users", "init/users.js");
await execJS("sec", "init/security.js");

const security = Kernel.extensions.get("genkernel");
const users = Kernel.extensions.get("users");

if (typeof localStorage.getItem("/etc/passwd") != "string") {
  await users.addUser("root", ["root"], 0, "toor");
}

console.log("init_stage0: Loading init with sandboxing enabled...");
const KernelSec = await security("root");

async function secExecJS(name, path) {
  const data = await read(path);

  await KernelSec.process.spawn(name, data); 
}

console.log("INFO: Bringing up vfs...");
await secExecJS("initvfs", "init/vfs.js");

console.log("INFO: Bootstrapping OS...");
await secExecJS("sys", "init/sys.js");
await secExecJS("bootstrap", "init/bootstrap.js");

console.log("INFO: Running colossal_dbg_rootlevel...");
await execJS("colossal_dbg_rootlevel", "colossal_dbg/colossal_dbg_rootlevel.js");

console.log("INFO: Running colossal_dbg_userlevel_root_shell...");
const VFS = KernelSec.extensions.get("Vfs");
const shell = await read("colossal_dbg/colossal_dbg_userlevel_root_shell.js");

VFS.write("/bin/dbshell", "UWU;;\n\n" + shell);
VFS.write("/etc/ttysh.conf", "shell=/bin/dbshell");

await KernelSec.process.spawn("/bin/ttysh", VFS.read("/bin/ttysh").replace("UWU;;\n\n", ""));

console.log("INFO: Finished all tests. Waiting 10 seconds, then rebooting...");
await sleep(10000);