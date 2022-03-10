let motd = "Welcome!\nTo get a list of commands, run 'help'.";

kernel.stdout(
  "btm.sh v0.1.1\nRunning on femOS " +
  kernel.ver +
  " \n\n" +
  motd +
  "\n\n"
);

while (true) {
  kernel.stdout("# ");
  let stdin = await kernel.stdin();
  let args = stdin.split(" ");
  args.shift();

  let isFound = false;

  for (func of Applications) {
    if (stdin.startsWith(func.name)) {
      isFound = true;
      try {
        await kernel.pexec(func.name, func.function, args);
      } catch (e) {
        kernel.stdout("\n" + func.name + ": segmentation fault (core dumped)");
      }
    }
  }

  if (!isFound) {
    kernel.stdout("Unknown command.\n");
  } else {
    kernel.stdout("\n");
  }
}
