if (args[0] == undefined) {
    kernel.stdout("No arguments specified.\n");
    kernel.stdout("Usage: rc [command] <args>\n");
    kernel.stdout("To get help, run 'rc help'.");
    return;
}

if (args[0] == "help") {
    kernel.stdout("rc - Modify system settings.\n");
    kernel.stdout("Commands:\n");
    kernel.stdout("startupApp - Changes the Application to launch at startup.");
} else if (args[0] == "startupApp") {
    if (args[1] == undefined) {
        kernel.stdout("No arguments specified.\n");
        kernel.stdout("Usage: rc [command] <args>\n");
        kernel.stdout("To get help, run 'rc help'.");
    }

    localStorage.setItem("autostart.rc", args[1]);

    kernel.stdout("Successfully set autostart program.");
} else {
    kernel.stdout("Invalid command.\n");
    kernel.stdout("Usage: rc [command] <args>\n");
    kernel.stdout("To get help, run 'rc help'.");
    return;
}