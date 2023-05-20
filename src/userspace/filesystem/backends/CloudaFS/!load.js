qb.enableRegularRequire();
require("./fs/index.mjs");

const cloudaEnableDebugLog = false;

async function loadClouda(userData) {
  if (!('indexedDB' in window)) {
    const err = `
!!! Error !!!

You are attempting to load EclipseOS with CloudaFS (the Clouda filesystem).
Your browser does not currently support IndexedDB, a required element to load CloudaFS.
Therefore, I am going to set the filesystem backend to be 'gbrfs'.
`;
    localStorage["active_fs"] = "gbrfs";
    alert(err);

    window.location.reload();

    return;
  }

  const fsCreated = new CloudaFS("EclipsePROD_", cloudaEnableDebugLog, userData);
  await fsCreated.init();

  return fsCreated;
}