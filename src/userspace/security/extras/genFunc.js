function genFunc(funcRaw) {
  let allBanned = ["self"];
  let notElevatedBanned = ["localStorage", "document", "self"];

  const funcStr = typeof funcRaw != "string" ? funcRaw.toString() : funcRaw;
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

  const localBanned = account.permLevel == 0 ? [...allBanned] : [...notElevatedBanned, ...allBanned];
  return AsyncFunction("argv", "Kernel", "pid", "localStorage", ...localBanned, funcStr);
}