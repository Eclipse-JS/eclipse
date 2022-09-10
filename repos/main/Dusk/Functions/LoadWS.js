qb.enableRegularRequire();

function loadWS() {
  const fs = Kernel.extensions.get("Vfs");

  require("./Loader/WindowServer.js");
  require("./Loader/DawnUI.js");
  
  return true;
}