logger("info", "Downloading kernel...");
const kernel = await read("kernel.js");

logger("info", "Downloading stage 0 init...");
const stage0 = await read("init/index.js");

logger("info", "Downloading and applying low level libraries...");
const llLib = JSON.parse(localStorage.getItem("lowLevelLibraries"));

for (const i of llLib) {
  logger("info", "Downloading '" + i.name + "'...");
  const data = await read(i.path);

  if (!data.trim().startsWith("<")) {
    llLib[llLib.indexOf(i)].contents = data;
  }
}

localStorage.setItem("lowLevelLibraries", JSON.stringify(llLib));

logger("info", "Applying updates...");
localStorage.setItem("krnl", kernel);
localStorage.setItem("init", stage0);

logger("info", "Done! You may reboot.");