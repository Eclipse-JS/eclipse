async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

const osList = localStorage.getItem("os_list") ? JSON.parse(localStorage.getItem("os_list")) : [];
const uuid = uuidv4();

osList.push({ id: uuid });

const kernel = await read("/kernel.js");
const stage0 = await read("/init/index.js");

localStorage.setItem("os_list", JSON.stringify(osList));
localStorage.setItem(uuid + "__krnl", kernel);
localStorage.setItem(uuid + "__init", stage0);

localStorage.setItem(uuid + "__bootername", "EclipseOS (uwu)");

console.log("Patching kernel...");
const kernelOpts = `const BL_CMDLINE="fs_prefix='${uuid}__'"`;

// I know eval is unsafe, however, with the same logic, loading an OS from a bootloader is unsafe.
// Therefore, I don't give a crap.

eval(`${kernelOpts}\n\n${kernel}`);
console.log("Kernel has been loaded. Loading init...");

const process = Kernel.process.create(stage0);
await Kernel.process.spawn("init_stage0", process);