if (!windowServer.newWindow) {
    kernel.stdout("WindowServer is not running.");
    return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await windowServer.newWindow("hello-world", async function main(uuid) {
    let elem = document.getElementById(uuid);

    elem.innerHTML += "Hello World!";

    while (true) {
        await sleep(100);
    }
});