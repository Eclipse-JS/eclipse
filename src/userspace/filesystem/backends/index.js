qb.enableRegularRequire();
require("./gbrfs/!load.js");
require("./CloudaFS/!load.js");

function getEligibleFilesystems() {
  return [
    {
      name: "gbrfs",
      func: loadGbrfs
    },
    {
      name: "CloudaFS",
      func: loadClouda
    }
  ];
}