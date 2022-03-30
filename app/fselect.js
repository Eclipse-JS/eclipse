let arg = args[0];

if (args[1] !== undefined) {
  arg += ` ${args[1]}`;
}

switch (arg) {
  case "help":
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
    kernel.stdout("  repo md - List valid approved repositories.");
    break;
  case "install":
    kernel.stdout("Not implemented!");
    break;
  case "remove":
    kernel.stdout("Not implemented!");
    break;
  case "search":
    kernel.stdout("Not implemented!");
    break;
  case "repo add":
    if (args[2] == undefined) {
      kernel.stdout("Error: No repository specified.\n");
      kernel.stdout("Usage: fselect repo add <repo>\n");
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
    break;
  case "repo remove":
    if (args[2] == undefined) {
      kernel.stdout("Error: No repository specified.\n");
      kernel.stdout("Usage: fselect repo remove <repo>\n");
      kernel.stdout("Type 'fselect help' for more information.");
      break;
    }
    
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
    break;
  case "repo update":
    kernel.stdout("Not implemented!");
    break;
  default:
    kernel.stdout("Error: No command specified.\n");
    kernel.stdout("Usage: fselect <command> [args]\n");
    kernel.stdout("Type 'fselect help' for more information.");
    break;
}
