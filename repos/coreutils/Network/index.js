qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");
let hostname = VFS.existsSync("/etc/hostname", "file") ? VFS.read("/etc/hostname") : "localhost";

if (!extensionExists("libnet")) {
  Kernel.extensions.load("libnet", {
    setHostname: function(name) {
      VFS.write("/etc/hostname", name);
      hostname = name;
    },
    getHostname: function() {
      return hostname;
    }
  })
} else {
  const input = Kernel.extensions.get("input");

  input.stdout(`Network communications library:\n\n`);

  if (argv[0] == "set-hostname" && typeof argv[1] == "string") {
    input.stdout(`Set hostname to '${argv[1]}'\n`);
    VFS.write("/etc/hostname", argv[1]);

    hostname = argv[1];
  }
}