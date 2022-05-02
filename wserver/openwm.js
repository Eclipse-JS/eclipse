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

let hasStarted = false;

let terminal = Applications.find(app => { return app.name == "terminal" })

kernel.stdout(" - Running init tasks...\n");

if (localStorage.getItem("openwm_init.cfg") !== null) {
    let init = localStorage.getItem("openwm_init.cfg");
    init = init.split(";");

    for (i of init) {
        kernel.stdout(` - Running init task: ${i}...`);
        try {
            let app = Applications.find(app => { return app.name == i });

            if (app !== undefined) {
                windowServer.newWindow(app.name, app.function, {});
            }
        } catch (e) {
            kernel.stdout(": FAIL");
            console.error(e);
        }

        kernel.stdout("\n");
    }
}