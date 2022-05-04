if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await windowServer.newWindow("nepo", async function main(uuid) {
    let elem = document.getElementById(uuid);
    let Titlebar = document.createElement("h20");
    Titlebar.style.textDecoration = "bold";
    Titlebar.style.top = "5px";
    Titlebar.style.width = "100%";
    Titlebar.style.position = "absolute";
    Titlebar.style.textAlign = "center";

    while (true) {
        elem.innerHTML = "";
        Titlebar.innerHTML = windowServer.panelUtilities.getBelowWindowTitle();
        elem.appendChild(Titlebar);
        await sleep(20);
    }
}, {
    "isStatic": true,
    "noBorder": true,
    "alwaysOnTop": true,
    "width": "100%",
    "height": "25px",
    "top": "0px",
    "left": "0px"
});