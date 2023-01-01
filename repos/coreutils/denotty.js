if (!Deno) {
  console.error("Not running in Deno.");
  return 1;
}

const oldInput = Kernel.extensions.get("input");
const VFS = Kernel.extensions.get("Vfs");

const config = VFS.read("/etc/ttysh.conf").split("\n");
const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];

oldInput.registerInput({
  stdin: async () => prompt(""),
  stdout: function (textRaw) {
    const text = new TextEncoder().encode(textRaw);
    Deno.writeAllSync(Deno.stdout, text);
  },
});

const binData = VFS.read(shell);

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(i, process, []);

return;
