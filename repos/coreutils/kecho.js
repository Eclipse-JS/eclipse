const input = await Kernel.extensions.get("input");
const kprint = await Kernel.extensions.get("kprint");

kprint.log(argv.join(" "));
input.stdout("SUCCESS<Logged>: " + argv.join(" ") + "\n");