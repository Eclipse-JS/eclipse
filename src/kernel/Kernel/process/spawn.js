const pid = processCount;

processTree.push({
  name: name,
  id: pid,
});

processCount++;

try {
  await func(argv, typeof kernel == "object" ? kernel : Kernel, pid, localStorage);
} catch (e) {
  console.error(e);

  if (pid == 0) {
    panic("Attempted to kill init!", "KernelSpace", e);
  }
}

processTree.splice(processTree.indexOf({ name: name, id: pid }), 1);

if (pid == 0) {
  panic("Attempted to kill init!", "KernelSpace");
}