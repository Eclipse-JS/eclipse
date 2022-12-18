qb.enableRegularRequire();

document.title = "EclipseOS";
console.log("Init_stage0: Loading user libraries...");

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

async function execJS(name, data) {
  console.log(name, data);
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
    lowLevelLibraries[i].contents = await read(lowLevelLibraries[i].path);
  }

  await execJS(lowLevelLibraries[i].name, lowLevelLibraries[i].contents);
}

localStorage.setItem("lowLevelLibraries", JSON.stringify(lowLevelLibraries));

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
