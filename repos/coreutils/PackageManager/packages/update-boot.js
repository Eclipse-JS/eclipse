logger("info", "Downloading kernel...");
const kernel = await read("kernel.js");

logger("info", "Downloading stage 0 init...");
const stage0 = await read("init/index.js");

logger("info", "Applying updates...");
localStorage.setItem("krnl", kernel);
localStorage.setItem("init", stage0);

logger("info", "Done! You may reboot.");