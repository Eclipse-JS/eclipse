const args = argv;
const input = args.shift();

if (Kernel.accounts.getCurrentInfo().permLevel != 0) {
  input.stdout("You must be root!\n");
  return;
}

input.stdout("Buh bye!\n");

localStorage.clear();
window.location.reload();