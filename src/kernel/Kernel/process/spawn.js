const pid = processCount;
let errTrace;

processTree.push({
  name: name,
  id: pid,
});

processCount++;

try {
  await func(argv, typeof kernel == "object" ? kernel : Kernel, pid, localStorage);
} catch (e) {
  errTrace = e;
}

processTree.splice(processTree.indexOf({ name: name, id: pid }), 1);

if (pid == 0) {
  panic("Attempted to kill init!", "KernelSpace");
}

if (errTrace) throw errTrace;