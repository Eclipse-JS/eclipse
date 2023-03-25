qb.enableRegularRequire();
require("./fs/index.mjs");

const cloudaEnableDebugLog = false;

async function loadClouda() {
  const fsCreated = new CloudaFS("EclipsePROD_", cloudaEnableDebugLog);
  await fsCreated.init();

  return fsCreated;
}