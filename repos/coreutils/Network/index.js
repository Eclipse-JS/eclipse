const { netAPI } = require("./WebCore/DeviceCore.mjs");

qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");
let hostname = VFS.existsSync("/etc/hostname", "file") ? VFS.read("/etc/hostname") : "localhost";

require("./Functions/ExtensionExists.js");
require("./Functions/ArrayAllocate.js");

// Kaboom
require("./WebCore/DeviceCore.mjs");

if (!extensionExists("libnet")) {
  Kernel.extensions.load("libnet", {
    connect: netAPI.connect,
    listen: netAPI.listen,

    core: {
      hostname: {
        set: function(name) {
          VFS.write("/etc/hostname", name);
          hostname = name;
        },
        get: function() {
          return hostname;
        }
      },

      devices: {
        add: netAPI.core.addNetworkDevice,
        get: netAPI.core.getNetworkDevices
      },

      helper: {
        sanitize: netAPI.helperInternal.sanitizeIPMsg
      }
    }
  });
} else {
  const input = Kernel.extensions.get("input");

  input.stdout(`Network communications library:\n\n`);

  if (argv[0] == "set-hostname" && typeof argv[1] == "string") {
    input.stdout(`Set hostname to '${argv[1]}'\n`);
    VFS.write("/etc/hostname", argv[1]);

    hostname = argv[1];
  }
}