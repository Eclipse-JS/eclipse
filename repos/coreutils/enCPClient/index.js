qb.enableRegularRequire();

const net = Kernel.extensions.get("libnet");

require("./Core/validateServer.mjs");
require("./Core/index.mjs");

await register();