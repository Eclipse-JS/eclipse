const input = await Kernel.extensions.get("input");

input.stdout(argv.join(" ") + "\n");