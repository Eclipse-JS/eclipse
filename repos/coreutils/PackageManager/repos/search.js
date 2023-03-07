const contents = JSON.parse(vfs.read("/etc/pkg/repos.json"));

if (!isSetUp()) {
  logger("error", "The package manager is not set up! Please run 'pkg init'.");
  break;
} else if (argv.length != 2) {
  logger("error", "Package not specified!");
  break;
}

for (const pkgProviderIndex of Object.keys(contents)) {
  console.log(contents[pkgProviderIndex]);

  for (const repo of contents[pkgProviderIndex].contents) {
    for (const i of Object.keys(repo.contents)) {
      if (i.toLowerCase().includes(argv[1]) || 
          argv[1].toLowerCase().includes(i)) {
        logger("info", i + ": " + repo.contents[i].ver);
        logger("info", ` - In repo: ${pkgProviderIndex}\\${repo.displayName}`);
        logger("info", " - Description of repo: " + repo.description);
      }
    }
  }
}