logger("info", "Bootstrapping...");

if (isSetUp()) {
  logger("error", "Pkg is already setup, silly!");
  break;
}

if (!vfs.existsSync("/etc/pkg", "directory")) vfs.mkdir("/etc/pkg");

logger("info", "Downloading root packages...");

const rootPkgServer = JSON.parse(await read("repos/rootpkgserver.json"));
let items = {};

items[rootPkgServer.identifier] = {
  contents: rootPkgServer.contents,
  path: "repos/rootpkgserver.json",
};

for (const index in items[rootPkgServer.identifier].contents) {
  const i = items[rootPkgServer.identifier].contents[index];
  logger("info", `Setting up repo '${i.name}'...`);

  const file = JSON.parse(await read("repos/" + i.path));

  items[rootPkgServer.identifier].contents[index].contents = file.packages;
}

vfs.write("/etc/pkg/repos.json", JSON.stringify(items));
vfs.write(
  "/etc/pkg/isSetup",
  "do you want a furry for christmas - August, 2022\n"
); // ;) hi