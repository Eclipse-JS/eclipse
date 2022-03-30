let motd = "Welcome!\nTo get a list of commands, run 'help'.";

kernel.stdout(
  "btm.sh v0.2.0\nRunning on femOS " + kernel.ver + " \n\n" + motd + "\n\n"
);

while (true) {
  kernel.stdout("# ");
  let stdin = await kernel.stdin();

  let isNotWaiting = false;

  if (stdin.endsWith("&")) {
    isNotWaiting = true;
    let tmpStdin = stdin.split("");
    tmpStdin.pop();
    stdin = tmpStdin.join("");
  }

  let args = stdin.split(" ");
  args.shift();

  let isFound = false;

  for (func of Applications) {
    if (stdin.startsWith(func.name)) {
      isFound = true;
      try {
        if (isNotWaiting) {
          kernel.pexec(func.name, func.function, args);
        } else {
          await kernel.pexec(func.name, func.function, args);
        }
      } catch (e) {
        kernel.stdout("\n" + e);
      }
    }
  }

  if (!isFound) {
    kernel.stdout("Unknown command.\n");
  } else {
    kernel.stdout("\n");
  }
}
