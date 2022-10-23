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
  const args = argv;
  const input = args.shift();

  input.stdout(`Network communications library:\n\n`);

  if (args[0] == "set-hostname" && typeof args[1] == "string") {
    input.stdout(`Set hostname to '${args[1]}'\n`);
    hostname = args[1];
  }
}