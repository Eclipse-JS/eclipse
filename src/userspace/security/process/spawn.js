const pid = Kernel.process.getPID(); // Hack to get pid
const func = genFunc(funcStr);

const item = {
  name: name,
  id: pid,
  userInfo: account,
};

processTreeExtras.push(item);

await Kernel.process.spawn(name, func, argv, genKernel(account));

processTreeExtras.splice(processTreeExtras.indexOf(item), 1);
