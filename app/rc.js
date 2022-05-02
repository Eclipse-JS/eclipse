if (args[0] == undefined) {
    kernel.stdout("No arguments specified.\n");
    kernel.stdout("Usage: rc [command] <args>\n");
    kernel.stdout("To get help, run 'rc help'.");
    return;
}

if (args[0] == "help") {
    kernel.stdout("rc - Modify system settings.\n");
    kernel.stdout("Commands:\n");
    kernel.stdout("startupApp - Changes the Application to launch at startup.\n");
    kernel.stdout("nuke - Force resets all packages before boot on startup.");
    return;
} else if (args[0] == "startupApp") {
    if (args[1] == undefined) {
        kernel.stdout("No value specified!\n");
        kernel.stdout("Usage: rc [command] <args>\n");
        kernel.stdout("To get help, run 'rc help'.");
        return;
    }

    localStorage.setItem("autostart.rc", args[1]);

    kernel.stdout("Successfully set autostart program.");
    return;
} else if (args[0] == "nuke") {
    if (args[1] !== "toggle" && args[1] !== "on" && args[1] !== "off") {
        kernel.stdout("No value specified! [toggle, on, off]\n");
        kernel.stdout("Usage: rc [command] <args>\n");
        kernel.stdout("To get help, run 'rc help'.");
        return;
    }

    if (args[1] == "toggle") {
        if (localStorage.getItem("nuke.rc") == "true") {
            localStorage.removeItem("nuke.rc");
            kernel.stdout("Nuke is now off.");
        } else {
            localStorage.setItem("nuke.rc", "true");
            kernel.stdout("Nuke is now on.");
        }
    }

    if (args[1] == "on") {
        localStorage.setItem("nuke.rc", "true");
        kernel.stdout("Nuke is now on.");
    }

    if (args[1] == "off") {
        localStorage.removeItem("nuke.rc");
        kernel.stdout("Nuke is now off.");
    }
} else {
    kernel.stdout("Invalid command.\n");
    kernel.stdout("Usage: rc [command] <args>\n");
    kernel.stdout("To get help, run 'rc help'.");
    return;
}