const VFS = Kernel.extensions.get("Vfs");

let bannedKbdKeys = [
  "Control",
  "Alt",
  "WakeUp",
  "Meta",
  "OS",
  "Page",
  "Arrow",
  "Shift",
  "Escape",
  "CapsLock",
  "Tab",
  "Home",
  "End",
  "Insert",
  "Delete",
  "Unidentified",
  "F1",
  "F2",
  "F0",
  "ContextMenu",
  "AudioVolumeDown",
  "AudioVolumeUp",
];

const ctx = Kernel.display.getFramebuffer();

const config = VFS.read("/etc/ttysh.conf").split("\n");
const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];

let textfb = "";
let inputfb = "";
let inputIsActive = false;

Kernel.proxies.addEventListener("keydown", function(e) {
  if (!inputIsActive) return;

  if (e.key == "Enter") {
    inputIsActive = false;
    return;
  }

  if (e.key == "Backspace") {
    inputfb = inputfb.slice(0, -1);
    redraw(textfb + inputfb);
    return;
  }

  const filter = bannedKbdKeys.filter(ban => e.key.startsWith(ban));
  if (filter.length != 0) return;

  inputfb += e.key;

  redraw(textfb + inputfb);
})

const fontSize = 14;

function fillText(text, count) {
  ctx.font = fontSize + "px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(
    text,
    2,
    (fontSize * (count + count * 0.5)) - 4
  );
}

function redraw(textData) {
  const maxLines = Math.round((window.innerHeight/fontSize)/1.5);
  const text = textData.split("\n").map(item => item === undefined || item == "" ? ' ' : item);

  while (text.length > maxLines) text.shift();

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (var i = 1; i < maxLines+1; i++) {
    if (!text[i-1]) break;

    fillText(text[i-1], i);
  }
}

const input = {
  stdout: function(text) {
    if (text == "$c:clear") {
      textfb = "";
    } else {
      textfb += text;
    }

    redraw(textfb);
  },
  stdin: async function() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // TODO: Make custom API as a service or a kernel for this.
    inputIsActive = true;

    while (inputIsActive) await sleep(100);

    const input = inputfb;
    inputfb = "";

    this.stdout(input + "\n");

    return input;
  }
}

const binData = VFS.read(shell);

const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
await Kernel.process.spawn(i, process, [input]);