wipeUUIDFS("DEBUGTEST");

const kernel = await read("kernel.js");
const stage0 = await read("colossal_dbg/colossal_dbg_init.js");

console.log("Patching kernel...");
const kernelOpts = `const BL_CMDLINE="fs_prefix='DEBUGTEST__'"`;

// I know eval is unsafe, however, with the same logic, loading an OS from a bootloader is unsafe.
// Therefore, I don't give a crap.

eval(`${kernelOpts}\n\n${kernel}`);
console.log("Kernel has been loaded. Loading cs_dbg...");

const process = Kernel.process.create(stage0);
await Kernel.process.spawn("colossal_dbg_init", process);