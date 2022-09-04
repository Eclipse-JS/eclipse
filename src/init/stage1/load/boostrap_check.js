if (!VFS.existsSync("/etc/init.d/init.conf", "file")) {
  console.log("No binaries found! Loading liboostrap...");

  await execJS("bootstrap", "init/bootstrap.js");
}
