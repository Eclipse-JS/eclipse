qb.enableRegularRequire();

const VFS = await Kernel.extensions.get("Vfs");
const hostnameCheck = await VFS.exists("/etc/hostname", "file");

let hostname = hostnameCheck ? await VFS.read("/etc/hostname") : "localhost";

require("./Functions/ExtensionExists.js");
require("./Functions/ArrayAllocate.js");

// Kaboom
require("./WebCore/DeviceCore.mjs");

if (!(await extensionExists("libnet"))) {
  Kernel.extensions.load("libnet", {
    connect: netAPI.connect,
    listen: netAPI.listen,

    core: {
      // TODO: make hostnames more mainline
      hostname: {
        set: async function(name) {
          await VFS.write("/etc/hostname", name);
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

  // TODO: make as a switch statement
  if (argv[0] == "set-hostname" && typeof argv[1] == "string") {
    input.stdout(`Set hostname to '${argv[1]}'\n`);
    await VFS.write("/etc/hostname", argv[1]);

    hostname = argv[1];
  }
}