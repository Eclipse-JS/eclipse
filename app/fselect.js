if (args[0] == undefined) {
  kernel.stdout("Error: No command specified.\n");
  kernel.stdout("Usage: fselect <command> [args]\n");
  kernel.stdout("Type 'fselect help' for more information.");
  return;
}

if (args[0] == "help") {
  kernel.stdout("fselect version 0.1.0 - Not a furry package manager.\n");
  kernel.stdout("Usage: fselect <command> [args]\n");
  kernel.stdout("Available commands:\n");
  kernel.stdout("  help - Displays this help message.\n");
  kernel.stdout("  repo add <repo> - Adds a repository.\n");
  kernel.stdout("  repo remove <repo> - Removes a repository.\n");
  kernel.stdout("  repo update - Updates repository listings.\n");
  kernel.stdout("  install - Installs app.\n");
  kernel.stdout("  remove - Removes app.\n");
  kernel.stdout("  search - Searches for an app.\n");
  kernel.stdout("  manifest-details - List valid approved repositories.");
  return;
}

if (args[0] == "repo" && args[1] == "add") {
  if (args[2] == undefined) {
    kernel.stdout("Error: No repository specified.\n");
    kernel.stdout("Usage: execJS add <repo>\n");
    kernel.stdout("Type 'fselect help' for more information.");
  } else {
    let url = args[2];

    if (!url.startsWith("http://") || !url.startsWith("https://")) {
      if (!url.startsWith("/")) {
        url = "/" + url + "/manifest.json";
      } else {
        url = "https://" + url;
      }
    }

    let items = localStorage.getItem("fselect_manifest").toString().split("");
    items.pop();

    if (items.length - 1 == 0) {
      items.push('"' + url + '"');
    } else {
      items.push(',"' + url + '"');
    }

    items.push("]");

    localStorage.setItem("fselect_manifest", items.join(""));

    kernel.stdout("Added repository '" + url + "' to init.");
  }
} else if (args[0] == "repo" && args[1] == "remove") {
  let url = args[2];
  let items = [];

  if (!url.startsWith("http://") || !url.startsWith("https://")) {
    if (!url.startsWith("/")) {
      url = "/" + url + "/manifest.json";
    } else {
      url = "https://" + url;
    }
  }

  for (item of JSON.parse(localStorage.getItem("fselect_manifest"))) {
    if (item != url) {
      items.push(item);
    } else {
      kernel.stdout("Removed repository '" + url + "' from init.");
    }
  }

  localStorage.setItem("fselect_manifest", JSON.stringify(items));
} else if (args[0] == "repo" && args[1] == "update") {
  kernel.stdout("Not implemented.");
} else if (args[0] == "install") {
  kernel.stdout("Not implemented.");
} else if (args[0] == "uninstall") {
  kernel.stdout("Not implemented.");
} else if (args[0] == "search") {
  kernel.stdout("Not implemented.");
} else if (args[0] == "manifest-details") {
  kernel.stdout("Fetching from server...\n\n");

  let data = await axios.get("manifest_details.txt");

  kernel.stdout(data.data);
} else {
  kernel.stdout("Not a valid argument.");
}
