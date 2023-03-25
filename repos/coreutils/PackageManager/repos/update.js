if (!(await isSetUp())) {
  logger("error", "The package manager is not set up! Please run 'pkg init'.");
  break;
}

const oldContents = JSON.parse(await vfs.read("/etc/pkg/repos.json"));
let items = {};

for (const oldIndex of Object.keys(oldContents)) {
  const i = oldContents[oldIndex];
  logger("info", `Downloading root repo '${oldIndex}'...`);

  try {
    const rootURL = i.path;
    const data = JSON.parse(await read(rootURL));

    items[oldIndex] = {
      contents: data.contents,
      path: i.path
    }

    for (const index in items[oldIndex].contents) {
      const i = items[oldIndex].contents[index];
      logger("info", `Setting up repo '${i.name}'...`);

      const file = JSON.parse(await read(rootURL.replace("rootpkgserver.json", "") + i.path));

      items[oldIndex].contents[index].contents = file.packages;
    }
  } catch (e) {
    logger("error", `Failed to download root repo '${oldIndex}'.`);
  }
}

await vfs.write("/etc/pkg/repos.json", JSON.stringify(items));