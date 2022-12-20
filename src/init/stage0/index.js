qb.enableRegularRequire();

document.title = "EclipseOS";
console.log("init: Loading user libraries...");

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

async function execJS(name, data) {
  const processData = Kernel.process.create(data);
  await Kernel.process.spawn(name, processData); 
}

const lowLevelLibraries = localStorage.getItem("lowLevelLibraries") ? JSON.parse(localStorage.getItem("lowLevelLibraries")) : [
{
  name: "hashcat",
  path: "init/hashcat.js"
},
{
  name: "users",
  path: "init/users.js"
},
{
  name: "sec",
  path: "init/security.js"
},
{
  name: "vfs",
  path: "init/vfs.js"
},
{
  name: "sys",
  path: "init/sys.js"
}
];

for (const i in lowLevelLibraries) {
  if (!lowLevelLibraries[i].contents) {
    try {
      lowLevelLibraries[i].contents = await read(lowLevelLibraries[i].path);
    } catch (e) {
      Kernel.kernelLevel.panic("Failed to download library contents for " + lowLevelLibraries[i].name, "init::for_lowLevelLibraries", e);
    }

    localStorage.setItem("lowLevelLibraries", JSON.stringify(lowLevelLibraries));
  }

  await execJS(lowLevelLibraries[i].name, lowLevelLibraries[i].contents);
}

const security = Kernel.extensions.get("genkernel");
const users = Kernel.extensions.get("users");

if (!users.parseUser("root")) await users.addUser("root", ["root"], 0, "toor", "/root");

console.log("init: Loading init with sandboxing enabled...");
const nKernel = await security("root");

const env = nKernel.extensions.get("env");
const VFS = nKernel.extensions.get("Vfs");
const Sys = nKernel.extensions.get("sys");

Sys.drawLogo();
Sys.loadPercent(10);

console.log("init: Loading binaries...");

if (!VFS.existsSync("/etc/init.d/init.conf", "file")) {
  console.log("No binaries found! Loading liboostrap...");

  const bootstrap = await read("init/bootstrap.js");
  await nKernel.process.spawn("bootstrap", bootstrap.replaceAll("UWU;;\n\n", ""), []);
}

if (!VFS.existsSync("/root")) VFS.mkdir("/root");
if (!VFS.existsSync("/home")) VFS.mkdir("/home");

env.add("PATH", "/bin/")

console.log("Loading programs...");
const initPrgms = VFS.read("/etc/init.d/init.conf").split("\n");
const onloadProgram = VFS.read("/etc/init.d/initcmd.txt");

for (i of initPrgms) {
  try {
    const binData = VFS.read(i);

    await nKernel.process.spawn(i, binData.replaceAll("UWU;;\n\n", ""), []);
  } catch (e) {
    console.error("init: Failed to execute '" + i + "'.");
  }
}

const binData = VFS.read(onloadProgram);
await nKernel.process.spawn(i, binData.replaceAll("UWU;;\n\n", ""), []);
