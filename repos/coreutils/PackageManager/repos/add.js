if (!(await isSetUp())) {
  logger("error", "The package manager is not set up! Please run 'pkg init'.");
  break;
}

logger("info", "Attempting to add repo...");

const path = argv[1];
let testRead;

try {
  testRead = JSON.parse(await read(path));
} catch (e) {
  logger("error", "Failed to add repo! Repo may not exist or may be in invalid format.");
  break;
}

let contents = JSON.parse(await vfs.read("/etc/pkg/repos.json"));

contents[testRead.identifier] = {
  contents: testRead.contents,
  path: path
}

await vfs.write("/etc/pkg/repos.json", JSON.stringify(contents));

logger("info", `Added repo ${testRead.identifier}. Please run 'pkg update' after, or else.`);