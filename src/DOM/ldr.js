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

eval(localStorage.getItem("krnl"));

const init = localStorage.getItem("__init");
const initProc = Kernel.process.create(init);

await Kernel.process.spawn("init_stage0", initProc);