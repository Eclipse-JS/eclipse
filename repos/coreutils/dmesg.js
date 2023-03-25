const input = await Kernel.extensions.get("input");
const kprint = await Kernel.extensions.get("kprint");

const kprintLog = kprint.getLog();

for (const log of kprintLog) {
  const logMsg = `[${((log.time-kprintLog[0].time)/1000).toFixed(3)}] ${log.msg}\n`;

  input.stdout(logMsg);
}