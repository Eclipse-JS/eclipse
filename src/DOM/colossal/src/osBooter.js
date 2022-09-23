const kernel = localStorage.getItem("krnl_" + opt);
const stage0 = localStorage.getItem("init_" + opt);

console.log("Patching kernel...");
const kernelOpts = `const BL_CMDLINE="fs_prefix='${opt}__'"`;

// I know eval is unsafe, however, with the same logic, loading an OS from a bootloader is unsafe.
// Therefore, I don't give a crap.

eval(`${kernelOpts}\n\n${kernel}`);
console.log("Kernel has been loaded. Loading init...");

const process = Kernel.process.create(stage0);
await Kernel.process.spawn("init_stage0", process);