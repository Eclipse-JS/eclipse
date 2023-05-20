async function exec(path, args) {
  const file = await vfs.read(path);

  logger("info", `Starting '${path}' with args: '${args.join(" ")}'`);
  await Kernel.process.spawn(path, file.replace("UWU;;\n\n"), args);
}

await exec("/bin/pkg", ["update"]);
await exec("/bin/pkg", ["update-boot"]);

logger("info", "Fetching package caches...");
const packageCacheExists = await vfs.exists("/etc/pkg/caches.json", "file");
if (!packageCacheExists) return logger("error", "Package cache does not exist!");

const packageCache = JSON.parse(await vfs.read("/etc/pkg/caches.json"));
const packageUpdateList = packageCache.map((i) => i.pkgName);

logger("info", `Updating: '${packageUpdateList.join(" ")}'`);

await exec("/bin/pkg", ["install", ...packageUpdateList]);