const pid = processCount;

processTree.push({
  name: name,
  id: pid,
});

processCount++;

// Yes, I know that document and window will not be used. However, with an emulator for this OS (lets you use it without a browser running)
// that I'm working on, this is needed as we inject certain things to make everything kumbaya.'

try {
  if (BL_CMDLINE.includes("virtualized=true")) {
    // We have to strip the security from all binaries to get it to boot
    // todo this is dumb

    const undoPatchFunc1 = func.toString().split("{");
    undoPatchFunc1.shift();

    const undoPatchFunc2 = undoPatchFunc1.join("{").split("}");
    undoPatchFunc2.pop();

    const undoPatchFunc = Kernel.process.create(undoPatchFunc2.join("}"));

    await undoPatchFunc(argv, typeof kernel == "object" ? kernel : Kernel, pid, localStorage, document, window, fetch);
  } else {
    await func(argv, typeof kernel == "object" ? kernel : Kernel, pid, localStorage);
  }
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
