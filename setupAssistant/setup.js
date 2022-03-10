kernel.stdout("Welcome to femOS!\n");
kernel.stdout("What desktop type would you like?\n");

kernel.stdout("1. tty, base system\n");
kernel.stdout("2. Multimedia, base system + multimedia utilities\n");
kernel.stdout(
  "3. Desktop, base system + multimedia utilities + desktop utilities\n"
);
kernel.stdout("4. Programmer's Desktop, Desktop with programming utilities\n");
kernel.stdout("5. Custom, custom desktop\n");

kernel.stdout("> ");

let stdin = await kernel.stdin();

if (stdin == "1") {
  kernel.stdout("Please wait...");
  localStorage.setItem("autostart.rc", "btm.sh");
  localStorage.setItem("fselect_manifest", '["/app/manifest.json"]');

  window.location.reload();
  await sleep(5000);
} else if (stdin == "2") {
  kernel.stdout("Please wait...");
  localStorage.setItem("autostart.rc", "btm.sh");
  localStorage.setItem(
    "fselect_manifest",
    '["/app/manifest.json", "/av/manifest.json"]'
  );

  window.location.reload();
  await sleep(5000);
} else if (stdin == "3") {
  kernel.stdout("Please wait...");
  localStorage.setItem("autostart.rc", "wserv");
  localStorage.setItem(
    "fselect_manifest",
    '["/app/manifest.json", "/av/manifest.json", "/wserver/manifest.json", "/demos/manifest.json"]'
  );

  window.location.reload();
  await sleep(5000);
} else if (stdin == "4") {
  kernel.stdout("Please wait...");
  localStorage.setItem("autostart.rc", "wserv");
  localStorage.setItem(
    "fselect_manifest",
    '["/app/manifest.json", "/av/manifest.json", "/wserver/manifest.json", "/demos/manifest.json", "/programming/manifest.json"]'
  );

  window.location.reload();
  await sleep(5000);
} else if (stdin == "5") {
  kernel.stdout("Not implemented!\n");
  await sleep(1000);

  window.location.reload();
  await sleep(5000);
} else {
  kernel.stdout("Invalid option!");
  await sleep(1000);

  window.location.reload();
  await sleep(5000);
}
