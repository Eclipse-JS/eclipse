const ws = await Kernel.extensions.get("WindowServer");
const dawn = await Kernel.extensions.get("LibreDawn");

const users = await Kernel.extensions.get("users");

const VFS = await Kernel.extensions.get("Vfs");

const fb = Kernel.display.getFramebuffer();

async function exec(path, args) {
  const file = await VFS.read(path);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n"), args);
}

function centerWin(width, height) {
  const fbWidth = Kernel.display.size.getWidth();
  const fbHeight = Kernel.display.size.getHeight();

  const x = (fbWidth - width) / 2;
  const y = (fbHeight - height) / 2;

  return [Math.floor(y), Math.floor(x)];
}

const centered = centerWin(400, 600);

await ws.createWindow(centered[0], centered[1], 400, 600, function main(win) {
  return new Promise(async(resolve, reject) => {
    const ui = dawn.UIGenerator;
    win.title = "EclipseOS Setup Application"

    const span = document.createElement("span");
    span.innerText = "Welcome to EclipseOS!";
    span.style.position = "absolute";
    span.style.fontWeight = "bold";
    span.style.fontSize = "24px";
    span.style.top = "4px";
    span.style.left = "6px";
  
    const instructionText = document.createElement("span");
    instructionText.innerText = "First, answer these following prompts:";
    instructionText.style.position = "absolute";
    instructionText.style.top = "34px";
    instructionText.style.left = "7px";
  
    const optsDiv = document.createElement("div");
    optsDiv.style.position = "absolute";
    optsDiv.style.top = "60px";
    optsDiv.style.left = "6px";
  
    // Options here
    const usernameRequestSpan = document.createElement("span");
    usernameRequestSpan.innerHTML = "Username:&nbsp;";
  
    const usernameInput = ui.input.inputElem();
    usernameInput.style.position = "absolute";
    usernameInput.style.left = "70px";
    usernameInput.style.height = "20px";
  
    optsDiv.appendChild(usernameRequestSpan);
    optsDiv.appendChild(usernameInput);
    optsDiv.appendChild(document.createElement("br"));
  
    const passRequestSpan = document.createElement("span");
    passRequestSpan.innerHTML = "Password:&nbsp;";
  
    const passwordInput = ui.input.inputElem();
    passwordInput.type = "password";
    passwordInput.style.position = "absolute";
    passwordInput.style.left = "70px";
    passwordInput.style.height = "20px";
  
    optsDiv.appendChild(passRequestSpan);
    optsDiv.appendChild(passwordInput);
    optsDiv.appendChild(document.createElement("br"));
    optsDiv.appendChild(document.createElement("br"));
  
    const enablePermUI = document.createElement("span");
    enablePermUI.innerHTML = "Toggle desktop mode:&nbsp;"
  
    const enablePermUISwitch = ui.input.inputElem();
    enablePermUISwitch.type = "checkbox";

    const enableFutureFS = document.createElement("span");
    enableFutureFS.innerHTML = "Enable future FS (currently CloudaFS):&nbsp;"
  
    const enableFutureFSSwitch = ui.input.inputElem();
    enableFutureFSSwitch.type = "checkbox";
    enableFutureFSSwitch.checked = (await VFS.version()).startsWith("CloudaFS");
  
    optsDiv.appendChild(enablePermUI);
    optsDiv.appendChild(enablePermUISwitch);
    optsDiv.appendChild(document.createElement("br"));
    optsDiv.appendChild(enableFutureFS);
    optsDiv.appendChild(enableFutureFSSwitch);
  
    const btn = ui.input.buttonElem();
    btn.innerText = "Next";
    btn.style.position = "absolute";
    btn.style.bottom = "5px";  
    btn.style.right = "5px";
  
    win.appendChild(span);
    win.appendChild(instructionText);
    win.appendChild(optsDiv);
    win.appendChild(btn);

    btn.addEventListener("click", async function() {
      win.title += " | Finishing Up Settings...";
      const newFSBackendName = enableFutureFSSwitch.checked ? "CloudaFS" : "gbrfs";

      // Reset the OS when changing the filesystem, so we don't get partial installs.
      // A better way to do this, is if there was a way we could manually call bootstrap from the OS,
      // then reconfigure everything, but there currently isn't an easy way to do that. For now, we'll
      // just nuke all changes to make it equal, to avoid having partially setup OSes.
      if (localStorage.getItem("active_fs") != newFSBackendName) {
        // Manually nuke the changes because I'm too lazy to debug why nuke doesn't work in this context.
        if (newFSBackendName == "gbrfs") indexedDB.deleteDatabase("EclipsePROD__CloudaFS");
        localStorage.clear();

        // Set the new active FS, then "reboot".
        localStorage.setItem("active_fs", newFSBackendName);
        window.location.reload();

        return;
      }

      if (enablePermUISwitch.checked) {
        await VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
        await VFS.write("/etc/ttysh.conf", "shell=/bin/dusk");

        await exec("/bin/pkg", ["install", "duskterm", "logind", "dpanel"]);
      } else {
        await VFS.write("/etc/ttysh.conf", "shell=/bin/login");
      }

      await VFS.write("/etc/sonnesvr/dusk.conf.json", JSON.stringify({
        autoStart: "/bin/logind"
      }));

      await users.addUser(usernameInput.value, [usernameInput.value], 1, passwordInput.value);
      resolve();
    });
  
    while (true) {
      await new Promise((i) => setTimeout(i, 1000));
    }
  })
});

window.location.reload();