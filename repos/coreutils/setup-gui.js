const ws = await Kernel.extensions.get("WindowServer");
const dawn = await Kernel.extensions.get("LibreDawn");

const users = await Kernel.extensions.get("users");

const VFS = await Kernel.extensions.get("Vfs");

await ws.createWindow(300, 300, 400, 600, async function main(win) {
  let hasFinishedFlag = false;
  
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
  
  optsDiv.appendChild(enablePermUI);
  optsDiv.appendChild(enablePermUISwitch);
  
  const btn = ui.input.buttonElem();
  btn.innerText = "Next";
  btn.style.position = "absolute";
  btn.style.top = "544px";  
  btn.style.left = "353px";
  
  win.appendChild(span);
  win.appendChild(instructionText);
  win.appendChild(optsDiv);
  win.appendChild(btn);

  btn.addEventListener("click", async function() {
    win.title += " | Finishing Up Settings...";

    if (enablePermUISwitch.checked) {
      await VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
      await VFS.write("/etc/ttysh.conf", "shell=/bin/dusk");
    } else {
      await VFS.write("/etc/ttysh.conf", "shell=/bin/login");
    }

    await VFS.write("/etc/sonnesvr/dusk.conf.json", JSON.stringify({
      autoStart: "/bin/duskterm"
    }));    

    await users.addUser(usernameInput.value, [usernameInput.value], 1, passwordInput.value);

    hasFinishedFlag = true;
  });
  
  while (true) {
    if (hasFinishedFlag) return;
    await new Promise((i) => setTimeout(i, 1000));
  }
});

window.location.reload();