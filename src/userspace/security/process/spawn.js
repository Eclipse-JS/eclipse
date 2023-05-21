const pid = Kernel.process.getPID(); // Hack to get pid
const item = {
  name: name,
  pid: pid,
  userInfo: account,
};

const func = genFunc(funcStr, item);
processTreeExtras.push(item);

try {
  await Kernel.process.spawn(name, func, argv, genKernel(account, item, inputProvider, envArgs));
} catch (e) {
  if (processTelementry) console.error("Error in proc: %s, pid: %s", processTelementry.name, processTelementry.id);
  console.error(e);
}

processTreeExtras.splice(processTreeExtras.indexOf(item), 1);
