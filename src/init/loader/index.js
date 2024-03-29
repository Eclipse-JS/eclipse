qb.enableRegularRequire();

document.title = "EclipseOS";
const kprint = await Kernel.extensions.get("kprint");
kprint.log("init: Loading libraries...");

const fbData = Kernel.display.getFramebuffer(true);

// Again, not sandboxed yet, so *should* be fine(?)
fbData.style.backgroundColor = "#000000";

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
}
];

for (const i in lowLevelLibraries) {
  if (!lowLevelLibraries[i].contents) {
    try {
      kprint.log("init: Downloading library '" + lowLevelLibraries[i].name + "'...");

      lowLevelLibraries[i].contents = await read(lowLevelLibraries[i].path);
    } catch (e) {
      Kernel.kernelLevel.panic("Failed to download library contents for " + lowLevelLibraries[i].name, "init::for_lowLevelLibraries", e);
    }

    localStorage.setItem("lowLevelLibraries", JSON.stringify(lowLevelLibraries));
  }

  kprint.log("init: Starting library '" + lowLevelLibraries[i].name + "'...");
  await execJS(lowLevelLibraries[i].name, lowLevelLibraries[i].contents);
}

const security = await Kernel.extensions.get("genkernel");
const users = await Kernel.extensions.get("users");

if (!users.parseUser("root")) await users.addUser("root", ["root"], 0, "toor", "/root");

kprint.log("Loading init with sandboxing enabled...");
const nKernel = await security("root");

const env = await nKernel.extensions.get("env");
const VFS = await nKernel.extensions.get("Vfs");

kprint.log("init: Loading binaries...");

if (!(await VFS.exists("/etc/init.d/init.conf", "file"))) {
  kprint.log("init: No binaries found! Loading liboostrap...");

  const bootstrap = await read("init/bootstrap.js");
  await nKernel.process.spawn("bootstrap", bootstrap.replaceAll("UWU;;\n\n", ""), []);
}

if (!(await VFS.exists("/root"))) await VFS.mkdir("/root");
if (!(await VFS.exists("/home"))) await VFS.mkdir("/home");

env.add("PATH", "/bin/")

kprint.log("init: Loading programs...");
const initPrgmsUnparsed = await VFS.read("/etc/init.d/init.conf");
const initPrgms = initPrgmsUnparsed.split("\n");

const onloadProgram = await VFS.read("/etc/init.d/initcmd.txt");

for (i of initPrgms) {
  try {
    const binData = await VFS.read(i);

    await nKernel.process.spawn(i, binData.replaceAll("UWU;;\n\n", ""), []);
  } catch (e) {
    kprint.error("init: Failed to execute '" + i + "'.");
    console.log(e);
  }
}

kprint.log("init: Starting main process...");

const binData = await VFS.read(onloadProgram);
await nKernel.process.spawn(i, binData.replaceAll("UWU;;\n\n", ""), []);
