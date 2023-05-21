async function parseAllDesktopEntries() {
  const jsonList = [];
  if (!(await fs.exists("/etc/sonnesvr/desktop", "folder"))) {
    await fs.mkdir("/etc/sonnesvr/desktop");
    await fs.write("/etc/sonnesvr/desktop/duskterm.desktop.json", JSON.stringify({
      path: "/bin/duskterm",
      name: "DuskTerm"
    }));
  }

  for await (const fileName of await fs.readDir("/etc/sonnesvr/desktop")) {
    if (!(await fs.exists(fileName, "file"))) continue;

    const file = await fs.read(fileName);
    try {
      JSON.parse(file)
    } catch (e) {
      continue;
    }

    const fileParsed = JSON.parse(file);
    if (!fileParsed.path || !fileParsed.name) continue;

    jsonList.push(fileParsed);
  }

  return jsonList;
}