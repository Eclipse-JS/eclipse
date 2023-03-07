const contents = JSON.parse(vfs.read("/etc/pkg/repos.json"));

for (const pkgProviderIndex of Object.keys(contents)) {
  console.log(contents[pkgProviderIndex]);

  for (const repo of contents[pkgProviderIndex].contents) {
    for (const i of Object.keys(repo.contents)) {
      if (i.toLowerCase().includes(argv[1]) || 
          argv[0].toLowerCase().includes(i)) {
        logger("info", i + ": " + repo.contents[i].ver);
        logger("info", ` - In repo: ${pkgProviderIndex}\\${repo.displayName}`);
        logger("info", " - Description of repo: " + repo.description);
      }
    }
  }
}