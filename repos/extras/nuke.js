const FS = await Kernel.extensions.get("Vfs");
const input = await Kernel.extensions.get("input");

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("You must be root!\n");
  return;
}

if ((await FS.version()).startsWith("CloudaFS")) {
  if (!indexedDB.databases) {
    input.stdout("WARN: Partially incompatible. (https://bugzilla.mozilla.org/show_bug.cgi?id=934640)\n");
    indexedDB.deleteDatabase("EclipsePROD__CloudaFS"); // Guess the DB name.
  } else {
    for (const db of await indexedDB.databases()) {
      indexedDB.deleteDatabase(db);
    }
  }
}

input.stdout("Buh bye!\n");

localStorage.clear();
window.location.reload();