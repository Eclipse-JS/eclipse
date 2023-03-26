//await Kernel.accounts.elevate("nobody", "nobody");

const ws = await Kernel.extensions.get("WindowServer");
const dawn = await Kernel.extensions.get("LibreDawn");

const VFS = await Kernel.extensions.get("Vfs");

const fb = Kernel.display.getFramebuffer();

if (!await VFS.exists("/etc/sonnesvr/gls.conf.json", "file")) {
  if (!await VFS.exists("/etc/sonnesvr")) await VFS.mkdir("/etc/sonnesvr");
  await VFS.write("/etc/sonnesvr/gls.conf.json", JSON.stringify({
    exec: "/bin/duskterm"
  }));
}

const conf = JSON.parse(await VFS.read("/etc/sonnesvr/gls.conf.json"));

async function exec(path, args) {
  const file = await VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n"), args);
}

function style(elem) {
  elem.style.position = "absolute";
  elem.style.left = "70px";
  
  elem.style.width = "290px";
  elem.style.height = "20px";
}

function centerWin(width, height) {
  const fbWidth = Kernel.display.size.getWidth();
  const fbHeight = Kernel.display.size.getHeight();

  const x = (fbWidth - width) / 2;
  const y = (fbHeight - height) / 2;

  return [Math.floor(y), Math.floor(x)];
}

const canvas = fb.createElement("canvas");
if (true) { // TODO: Add banner support
  canvas.width = 365;
  canvas.height = 79;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const centered = centerWin(365, 178);
centered[0] -= 200;

await ws.createWindow(centered[0], centered[1], 365, 178, function logindMain(win) {
  return new Promise(async(resolve, reject) => {
    const ui = dawn.UIGenerator;
    win.title = "Login to EclipseOS";
  
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";

    win.appendChild(canvas);

    const mainDiv = fb.createElement("div");
    mainDiv.style.position = "absolute";
    mainDiv.style.padding = "3px";
    mainDiv.style.top = "80px";
    mainDiv.style.left = "0px";
    mainDiv.style.width = "0px";
    mainDiv.style.height = "0px";
  
    const usernameRequestSpan = fb.createElement("span");
    usernameRequestSpan.innerHTML = "Username:&nbsp;";

    const usernamePrompt = ui.input.inputElem();
    style(usernamePrompt);

    const passwordRequestSpan = fb.createElement("span");
    passwordRequestSpan.innerHTML = "Password:&nbsp;";

    const passwordPrompt = ui.input.inputElem();
    passwordPrompt.type = "password";
    style(passwordPrompt);

    mainDiv.appendChild(usernameRequestSpan);
    mainDiv.appendChild(usernamePrompt);
    mainDiv.appendChild(fb.createElement("br"));

    mainDiv.appendChild(passwordRequestSpan);
    mainDiv.appendChild(passwordPrompt);

    const btn = ui.input.buttonElem();
    btn.innerText = "Login";
    btn.style.position = "absolute";
    btn.style.bottom = "5px";
    btn.style.right = "5px";

    win.appendChild(canvas);
    win.appendChild(mainDiv);
    win.appendChild(btn);

    btn.addEventListener("click", async function(e) {
      const runEscalate = await Kernel.accounts.elevate(usernamePrompt.value, passwordPrompt.value);

      if (runEscalate) resolve();
    })

    while (true) {
      await new Promise((i) => setTimeout(i, 200000));
    }
  });
});

const app = await VFS.read(conf.exec);
await Kernel.process.spawn(conf.exec, app.replace("UWU;;\n\n", ""), []);