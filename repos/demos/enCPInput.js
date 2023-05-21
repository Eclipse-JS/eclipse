
const input = await Kernel.extensions.get("input");
const net = await Kernel.extensions.get("libnet");
const VFS = await Kernel.extensions.get("Vfs");

const devs = net.core.devices.get();

const relayDev = devs.find((i) => i.name.startsWith("relay"));
if (!relayDev) return input.stdout("enCP Server not running!\n");

const ip = `${relayDev.networkID.deviceID}.${relayDev.networkID.firstSubnetID}.${relayDev.networkID.secondSubnetID}.${relayDev.hostIDs[0]}`;
const server = await net.listen(ip, 19132);
input.stdout(`Server started at ${ip}:19132.\n`);

server.on("connection", async(client) => {
  const newInput = {
    stdout(text) {
      if (text == "$c:clear") return client.send(JSON.stringify({
        type: "stdoutClear"
      }))

      client.send(JSON.stringify({
        type: "stdout",
        data: text
      }))
    },

    async stdin() {
      client.send(JSON.stringify({
        type: "stdinRequest"
      }));
      
      while (!client.formedMessage) await new Promise((i) => setTimeout(i, 50));
      const msg = client.formedMessage;
      client.formedMessage = null;

      return msg;
    }
  };

  // Normally I would be concerned, but the created process inherits some properties from the parent process,
  // including the input. So even though we override it like hotcakes, we should be fine.
  input.registerInput(newInput);
  newInput.stdout("Welcome to the -enCP- demo portal.\nStarting /bin/login...\n\n");
  try {
    const binData = await VFS.read("/bin/login");

    const process = Kernel.process.create(binData.replaceAll("UWU;;\n\n", ""));
    Kernel.process.spawn("[via-enCP] /bin/sh", process, []);
  } catch (e) {
    newInput.stdout("Execution stopped! Check EclipseOS logs for more information.\n");
    console.error(e);
  }

  client.on("message", (msg) => {
    try {
      JSON.parse(msg);
    } catch (e) {
      return client.send(JSON.stringify({
        error: "Not valid JSON."
      }));
    }

    const messageParsed = JSON.parse(msg);
    switch (messageParsed.type) {
      default: {
        return client.send(JSON.stringify({
          error: "Not a valid message type."
        }))
      }

      case "stdin": {
        if (!messageParsed.data) return client.send(JSON.stringify({
          error: "Not a valid message type."
        }));

        client.formedMessage = `${messageParsed.data}`;
      }
    }
  });
});

/*
while (true) {
  await new Promise((i) => setTimeout(i, 1000000));
}
*/