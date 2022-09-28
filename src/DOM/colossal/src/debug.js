async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

function wipeUUIDFS(uuid) {
  let arr = []; // Array to hold the keys
  // Iterate over localStorage and insert the keys that meet the condition into arr
  for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).startsWith(uuid)) {
        arr.push(localStorage.key(i));
    }
  }

  // Iterate over arr and remove the items by key
  for (var i = 0; i < arr.length; i++) {
    localStorage.removeItem(arr[i]);
  }
}

const uuid = "DEBUGTEST";

wipeUUIDFS(uuid);

const kernel = await read("kernel.js");
const stage0 = await read("colossal_dbg/colossal_dbg_init.js");

console.log("Patching kernel...");
const kernelOpts = `const BL_CMDLINE="fs_prefix='${uuid}__'"`;

// I know eval is unsafe, however, with the same logic, loading an OS from a bootloader is unsafe.
// Therefore, I don't give a crap.

eval(`${kernelOpts}\n\n${kernel}`);
console.log("Kernel has been loaded. Loading cs_dbg...");

const process = Kernel.process.create(stage0);
await Kernel.process.spawn("colossal_dbg_init", process);