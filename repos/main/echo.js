const args = argv;
const input = args.shift();

input.stdout(args.join(" ") + "\n");