const input = Kernel.extensions.get("input");
const kprint = Kernel.extensions.get("kprint");

kprint.log(argv.join(" "));
input.stdout("SUCCESS<Logged>: " + argv.join(" ") + "\n");