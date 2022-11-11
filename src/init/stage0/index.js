qb.enableRegularRequire();

document.title = "EclipseOS";
console.log("Init_stage0: Loading user libraries...");

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

let isYolo;

if (!users.parseUser("root")) {
  isYolo = true;
  await users.addUser("root", ["root"], 0, "toor", "/root");
}

console.log("init_stage0: Loading init with sandboxing enabled...");
const newKernel = await security("root");

const file = await read("init/init.js");
const process = Kernel.process.create(file);

await Kernel.process.spawn("init", process, [isYolo], newKernel);