function genFunc(funcRaw, procInfo) {
  const allBanned = ["self"];
  const notElevatedBanned = ["localStorage", "document", "self"];

  const funcStr = typeof funcRaw != "string" ? funcRaw.toString() : funcRaw;
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

  const localBanned = account.permLevel == 0 ? [...allBanned] : [...notElevatedBanned, ...allBanned];
  const functionGenerated = AsyncFunction("argv", "Kernel", "pid", "localStorage", ...localBanned, funcStr);

  return functionGenerated.bind(procInfo);
}