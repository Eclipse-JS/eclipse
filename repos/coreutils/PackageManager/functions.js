function logger(type, ...args) {
  input.stdout(`[${type.toUpperCase()}] ${args.join(" ")}\n`);
}

async function read(path) {
  const data = await fetch(path);
  const dataText = await data.text();

  return dataText;
}

function help() {
  const cmds = [
    {
      name: "init",
      desc: "Initialize package manager (First install only)"
    },
    {
      name: "search",
      desc: "Searches for a package"
    },
    {
      name: "update",
      desc: "Updates package lists"
    },
    {
      name: "update-boot",
      desc: "Updates kernel and low level processes. Init is not required for this command."
    },
    {
      name: "add-repo",
      desc: "Adds repo"
    },
    {
      name: "install",
      desc: "Installs package"
    }
  ]

  for (i of cmds) {
    input.stdout(`${i.name}: ${i.desc}\n`);
  }
}

async function isSetUp() {
  if (await vfs.exists("/etc/pkg/isSetup", "file")) return true;
  return false;
}

function appendHeader(str) {
  return "UWU;;\n\n" + str;
}