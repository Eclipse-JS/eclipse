const pid = Kernel.process.getPID(); // Hack to get pid
const func = genFunc(funcStr);

const item = {
  name: name,
  id: pid,
  userInfo: account,
};

processTreeExtras.push(item);

try {
  await Kernel.process.spawn(name, func, argv, genKernel(account, item, inputProvider, envArgs));
} catch (e) {
  if (processTelementry) console.error("Error in proc: %s, pid: %s", processTelementry.name, processTelementry.id);
  console.error(e);
}

processTreeExtras.splice(processTreeExtras.indexOf(item), 1);
