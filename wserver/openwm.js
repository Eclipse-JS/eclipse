kernel.stdout("OpenWM is starting up...\n");
kernel.stdout(" - Checking if WindowServer is running...\n");

if (typeof windowServer.newWindow == "function") {
    kernel.stdout(" - WindowServer is already running!");
    return;
}

for (i of Applications) {
    if (i.name == "wserv") {
        kernel.pexec("wserv", i.function, []);
    }
}

if (typeof windowServer.newWindow !== "function") {
    kernel.stdout(" - WindowServer failed to start!");
    return;
}

windowServer.setDesktopWallpaper("#000000");

for (i of Applications) {
    if (i.name == "terminal") {
        try {
            await windowServer.newWindow(i.name, i.function);
        } catch (e) {
            console.error(e);
        }
    }
}