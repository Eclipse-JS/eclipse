if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await windowServer.newWindow("nepo", async function main(uuid) {
    let elem = document.getElementById(uuid);

    elem.innerHTML = "Hello World!";

    while (true) {
        await sleep(100);
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