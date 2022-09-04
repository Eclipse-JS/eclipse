function genFunc(funcRaw) {
  let allBanned = ["self"];
  let notElevatedBanned = ["localStorage", "document", "self"];

  const funcStr = typeof funcRaw != "string" ? funcRaw.toString() : funcRaw;
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

  if (account.permLevel == 0) return AsyncFunction("argv", "Kernel", "pid", ...allBanned, funcStr);
  return AsyncFunction("argv", "Kernel", "pid", ...notElevatedBanned, ...allBanned, funcStr);
}