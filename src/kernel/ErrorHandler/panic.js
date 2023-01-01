function panic(error, atLocation, trace) {
  let file = `panic!\n  ${error} @ ${atLocation}\n`;

  if (trace) file += `  Error: ${trace}\n`;

  file += "  Running applications:\n";

  for (const i of processTree) {
    file += `    ${i.name}: pid ${i.id}\n`;
  }

  file += "  Running extensions:\n";

  for (const i of extensions) {
    file += `    ${i.name}: ${i.isGenFunction ? "generatable" : "static"}\n`;
  }

  file +=
    "\nPlease report this panic to https://github.com/Eclipse-JS/eclipse!\n";

  localStorage.setItem("panic.log", file);

  alert("Kernel Fatal Error:\n\n" + file);
  window.location.reload();
}

function assert(test, msg) {
  if (!test) panic("Assertion failed!! " + msg, "KernelSpace::Anonymous");
}