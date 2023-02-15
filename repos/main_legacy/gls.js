// Graphical Library (Login) System

const { UIGenerator } = Kernel.extensions.get("LibDawn");
const ws = Kernel.extensions.get("wscompat");

const VFS = Kernel.extensions.get("Vfs");

// Sonne means sun in german, according to google
// I'm not original lmfao

if (!VFS.existsSync("/etc/sonnesvr/gls.conf.json", "file")) {
  if (!VFS.existsSync("/etc/sonnesvr")) VFS.mkdir("/etc/sonnesvr");
  VFS.write("/etc/sonnesvr/gls.conf.json", JSON.stringify({
    exec: VFS.existsSync("/bin/dwshell", "file") ? "/bin/dwshell" : "/bin/duskterm"
  }));
}

await ws.createWindow(500, 110, async function (canvasElement, update, addEventListener, removeEventListener) {
  canvasElement.title = "Login";
  update();

  let loginSuccessStatus = false;

  const ui = new UIGenerator(canvasElement, addEventListener, removeEventListener);
  
  ui.textLabel("Username:", 20, 30);
  ui.textLabel("Password:", 20, 60);

  const userInput = ui.inputField(90, 16, 400, 20);
  const passInput = ui.inputField(90, 46, 400, 20);

  const inputDoneButton = ui.button("Done", 490, 100);
  inputDoneButton.invertRenderOffset("left");

  inputDoneButton.updateClickEvent(async function() {
    const runEscalate = await Kernel.accounts.elevate(userInput.text, passInput.text);

    if (runEscalate) loginSuccessStatus = true;
  });

  while (true) {
    if (loginSuccessStatus) return;
    await new Promise(i => setTimeout(i, 50));
  }
});

const appData = JSON.parse(VFS.read("/etc/sonnesvr/gls.conf.json"));
const app = VFS.read(appData.exec);

await Kernel.process.spawn(appData.exec, app.replace("UWU;;\n\n"), []);