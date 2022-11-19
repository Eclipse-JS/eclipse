const VFS = Kernel.extensions.get("Vfs");

let hostname = "localhost";

function extensionExists(name) {
  try {
    Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}

if (!extensionExists("libnet")) {
  Kernel.extensions.load("libnet", {
    setHostname: function(name) {
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
    hostname = argv[1];
  }
}