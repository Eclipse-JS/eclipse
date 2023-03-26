// Loads UI Library
if (!(await extensionExists("LibreDawn"))) {
  input.stdout("WM<WARN>: UI Framework is not running. Attempting to start...\n");
  if (!(await VFS.exists("/bin/dawn", "file"))) {
    input.stdout("WM<FATAL> UI Framework is not installed! Aborting...\n");
    return false;
  } else if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
    input.stdout("WM<FATAL>: I am not running as root so I cannot load the UI. Sorry!\n");
    return false;
  }
  
  const dawnData = await VFS.read("/bin/dawn");

  // Pipe all stdout and input to null -- It gets logged to the console anyways
  await Kernel.process.spawn("/bin/dawn", dawnData.replaceAll("UWU;;\n\n", ""), []);
}
