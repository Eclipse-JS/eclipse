if (args[0] == undefined) {
  kernel.stdout("Error: No command specified.\n");
  kernel.stdout("Usage: fselect <command> [args]\n");
  kernel.stdout("Type 'fselect help' for more information.");
  return;
}

if (args[0] == "help") {
  kernel.stdout("fselect version 0.1.0 - Adds repositories to init!\n");
  kernel.stdout("Usage: fselect <command> [args]\n");
  kernel.stdout("Available commands:\n");
  kernel.stdout("  help - Displays this help message.\n");
  kernel.stdout("  add <repo> - Adds a repository to init!\n");
  kernel.stdout("  remove <repo> - Removes a repository from init!\n");
  kernel.stdout("  manifest-details - List valid approved repositories.");
  return;
}

if (args[0] == "add") {
  if (args[1] == undefined) {
    kernel.stdout("Error: No repository specified.\n");
    kernel.stdout("Usage: execJS add <repo>\n");
    kernel.stdout("Type 'fselect help' for more information.");
  } else {
    let url = args[1];

    if (!url.startsWith("http://") || !url.startsWith("https://")) {
      if (!url.startsWith("/")) {
        url = "/" + url + "/manifest.json";
      } else {
        url = "https://" + url;
      }
    }

    kernel.stdout("Adding repository '" + url + "' to init...");

    let items = localStorage.getItem("fselect_manifest").toString().split("");
    items.pop();

    if (items.length - 1 == 0) {
      items.push('"' + url + '"');
    } else {
      items.push(',"' + url + '"');
    }

    items.push("]");

    localStorage.setItem("fselect_manifest", items.join(""));
  }
} else if (args[0] == "remove") {
  kernel.stdout("Not implemented.");
} else if (args[0] == "manifest-details") {
  kernel.stdout("Fetching from server...\n\n");

  let data = await axios.get("manifest_details.txt");

  kernel.stdout(data.data);
} else {
  kernel.stdout("Not a valid argument.");
}
