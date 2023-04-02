const isSafariBrowser = () => navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

if (!localStorage.getItem("__init")) {
  const init = await read("init/index.js");
  localStorage.setItem("__init", init);
}

if (!localStorage.getItem("krnl")) {
  const kernel = await read("kernel.js");
  localStorage.setItem("krnl", kernel);
}

if (isSafariBrowser()) {
  alert(`ldr.js WARNING:
I have detected that you are currently using the Safari browser.
EclipseOS runs on Safari, but the UI is broken, possibly due to fonts.
If you want the best experience, use the Eclipse reference browser, Firefox.`);
}

eval(localStorage.getItem("krnl"));

const init = localStorage.getItem("__init");
const initProc = Kernel.process.create(init);

await Kernel.process.spawn("init_stage0", initProc);