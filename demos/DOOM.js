if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await windowServer.newWindow("hello-world", async function main(uuid) {
    let elem = document.getElementById(uuid);
    let doom = document.createElement("iframe");
    elem.innerHTML = "Loading dos.zone...";
    elem.title = "DOOM haha very fun";

    doom.src = "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1";
    doom.style.width = "100%";
    doom.style.height = "100%";
    doom.style.border = "none";
    doom.allowFullscreen = false;

    elem.innerHTML = "";
    elem.appendChild(doom);

    window.addEventListener("message", (e) => {
        if (e.data.message === "dz-player-exit") {
            return;
        }
    });

    while (true) {
        await sleep(100);
    }
}, {
    "top": "50px",
    "left": "50px"
});