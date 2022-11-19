const input = Kernel.extensions.get("input");

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("I am not running as root! Aborting...\n");
  return;
}

window.location.reload();