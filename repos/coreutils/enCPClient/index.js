qb.enableRegularRequire();

const net = await Kernel.extensions.get("libnet");

require("./Core/validateServer.mjs");
require("./Core/index.mjs");

await register();