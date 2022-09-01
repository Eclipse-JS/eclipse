const VFS = Kernel.extensions.get("Vfs");
const Sys = Kernel.extensions.get("sys");
const users = Kernel.extensions.get("users");

async function fetchTextData(url) {
  const data = await fetch(url);
  const dataText = await data.text();

  return dataText;
}

const ctx = Kernel.display.getFramebuffer();

function fillText(text, count) {
  ctx.font = "14px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(
    text,
    2,
    12 * (count + count * 0.5)
  );
}

fillText("Bootstrapping directories...", 1)
if (!VFS.existsSync("/home", "folder")) VFS.mkdir("/home");
if (!VFS.existsSync("/root", "folder")) VFS.mkdir("/root");
if (!VFS.existsSync("/etc", "folder")) VFS.mkdir("/etc");
if (!VFS.existsSync("/usr", "folder")) VFS.mkdir("/usr");
if (!VFS.existsSync("/bin", "folder")) VFS.mkdir("/bin");

Sys.drawLogo();
Sys.loadPercent(15);

fillText("Downloading packages:", 2);
const data = JSON.parse(await fetchTextData("repos/main/packages.json"));
Sys.loadPercent(20);

fillText(" - VFS", 3);
const vfs = "UWU;;\n\n" + await fetchTextData("init/vfs.js");

localStorage.setItem("preboot_vfs", vfs);

let indexes = 3;

for (const index of Object.keys(data.packages)) {
  indexes++;
  fillText(" - " + index, indexes);

  const script = "UWU;;\n\n" + await fetchTextData("repos/main/" + data.packages[index].path);
  VFS.write("/bin/" + index, script);

  const percent = ((indexes-2)/Object.keys(data.packages).length)*100;

  Sys.loadPercent(percent);
}

fillText("Configuring packages...", indexes+2);
if (!VFS.existsSync("/etc/init.d", "folder")) VFS.mkdir("/etc/init.d");

VFS.write("/etc/init.d/init.conf", "/bin/net");
VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
VFS.write("/etc/ttysh.conf", "shell=/bin/login");

VFS.write("/etc/motd", `
_______      _ _                   _____    _    
(_______)    | (_)                 / ___ \\  | |   
 _____   ____| |_ ____   ___  ____| |   | |  \\ \\  
|  ___) / ___) | |  _ \ /___)/ _  ) |   | |   \\ \\ 
| |____( (___| | | | | |___ ( (/ /| |___| |____) )
|_______)____)_|_| ||_/(___/ \\____)\\_____(______/ 
                 |_|                              

Tip: The default username is anon, and the password is anonymous.
The root password is toor. ;-)

`)

await users.addUser("anon", ["anon"], 1, "anonymous");
await users.addUser("nobody", ["nobody"], 1, "browhatrudoinglmao");