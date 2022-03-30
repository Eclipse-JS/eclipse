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

switch (parseInt(stdin)) {
  default:
    kernel.stdout("Invalid option!");
    await sleep(1000);

    window.location.reload();
    await sleep(5000);
    return;
  case 1:
    kernel.stdout("Please wait...");
    localStorage.setItem("autostart.rc", "btm.sh");
    localStorage.setItem("fselect_manifest", '["/app/manifest.json"]');

    break;
  case 2:
    kernel.stdout("Please wait...");
    localStorage.setItem("autostart.rc", "btm.sh");
    localStorage.setItem(
      "fselect_manifest",
      '["/app/manifest.json", "/av/manifest.json"]'
    );

    break;
  case 3:
    kernel.stdout("Please wait...");
    localStorage.setItem("autostart.rc", "wserv");
    localStorage.setItem(
      "fselect_manifest",
      '["/app/manifest.json", "/av/manifest.json", "/wserver/manifest.json", "/demos/manifest.json"]'
    );

    break;
  case 4:
    kernel.stdout("Please wait...");
    localStorage.setItem("autostart.rc", "wserv");
    localStorage.setItem(
      "fselect_manifest",
      '["/app/manifest.json", "/av/manifest.json", "/wserver/manifest.json", "/demos/manifest.json", "/programming/manifest.json"]'
    );

    break;
  case 5:
    let items = [["Audio & Video utilities", "/av/manifest.json"], ["Demos", "/demos/manifest.json"], ["Programming utilities", "/programming/manifest.json"], ["Window Server", "/wserver/manifest.json"]];
    let manifest = '["/app/manifest.json", ';

    for (item of items) {
      kernel.stdout("Would you like " + item[0] + " to be installed? (y/n) ");

      let stdin = await kernel.stdin();

      if (stdin == "y" || stdin == "") {
        manifest += `"${item[1]}", `
      }
    }

    manifest = manifest.slice(0, -2);
    manifest += "]";
 
    console.log(manifest);

    kernel.stdout("\n\nPlease wait...\n\nNOTE: If you chose the window server, you need to manually make it start on boot.\nThis can be done by running 'rc startupApp wserv'.")
    localStorage.setItem("autostart.rc", "btm.sh");
    localStorage.setItem("fselect_manifest", manifest);
    
    break;
}

let items = []; //example pkg: {name: "fselect", version: "0.1.0", function: "base64data"}
let manifest = JSON.parse(localStorage.getItem("fselect_manifest"));
let manifestButYourMom = [];

kernel.stdout("\nBuilding package list...\n\n");

for await (item of manifest) {
  try {
    let resp = await axios.get(item);

    for (app of resp.data) {
      manifestButYourMom.push(app);
    }
  } catch (e) {
    kernel.stdout("Could not fetch '" + item + "'\n");
    console.error(e);
  }
}

for await (item of manifestButYourMom) {
  kernel.stdout("Installing package", item.name);

  try {
    let app = await axios.get(item.path);
    items.push({ name: item.name, version: item.version, function: btoa(app.data) });

    kernel.stdout(": Done.\n");
  } catch (e) {
    console.error(e);
    kernel.stdout(": Failed.\n");
  }
}

localStorage.setItem("packages.rc", JSON.stringify(items));

kernel.stdout("\n");