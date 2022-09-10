// Loads Window Server
if (!extensionExists("WindowServer")) {
  input.stdout("WM<WARN>: Window Manager is not running. Attempting to start...\n");
  if (!fs.existsSync("/bin/tinyws", "file")) {
    input.stdout("WM<FATAL> Window Manager is not installed! Aborting...\n");
    return false;
  } else if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
    input.stdout("WM<FATAL>: I am not running as root so I cannot spawn the WindowServer process. Sorry!");
    return false;
  }
  
  const wmData = fs.read("/bin/tinyws");

  // Pipe all stdout and input to null -- It gets logged to the console anyways
  Kernel.process.spawn("/bin/tinyws", wmData.replaceAll("UWU;;\n\n", ""), [{
    stdout: () => null,
    stdin: () => ""
  }]);
}