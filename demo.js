Applications = [
  {
    name: "top",
    function: async function (env) {
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      while (true) {
        kernel.stdout("jsKernelReq$cls");
        kernel.stdout("pid    name\n");

        for (data of kernel.plist) {
          kernel.stdout(data[1], "    ", data[0], "\n");
        }
        await sleep(900);
      }
    },
  },
  {
    name: "help",
    function(env) {
      kernel.stdout("List of commands:");

      for (app of Applications) {
        kernel.stdout(" ", app.name, " ");
      }
    },
  },
  {
    name: "execjs",
    async function() {
      kernel.stdout("execJS v0.1.0\n\n");

      while (true) {
        kernel.stdout("> ");
        let stdin = await kernel.stdin();

        if (stdin.startsWith(".exit")) {
          return;
        }

        let resp = "";

        try {
          resp = await eval(`JSON.stringify(${stdin})`);
        } catch (e) {
          resp = e;
        }
        kernel.stdout(resp, "\n");
      }
    },
  },
];

let motd = "Welcome!\nTo get a list of commands, run 'help'.";

document.addEventListener("DOMContentLoaded", async function () {
  await kernel.pexec("jshell", async function () {
    kernel.stdout("JShell, running on JSKernel\n\n", motd, "\n\n");

    while (true) {
      kernel.stdout("# ");
      let stdin = await kernel.stdin();

      let isFound = false;

      for (func of Applications) {
        if (stdin.startsWith(func.name)) {
          isFound = true;
          await kernel.pexec(func.name, func.function);
        }
      }

      if (!isFound) {
        kernel.stdout("Unknown command.\n");
      } else {
        kernel.stdout("\n");
      }
    }
  });
});
