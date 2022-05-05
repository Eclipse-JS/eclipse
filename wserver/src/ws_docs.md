# Window Server
## Hello world application
```js
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
```
This application stays open forever and creates a window named 'hello-world' with the contents of 'Hello World!'
## API Calls
### windowServer.newWindow();
This creates a new window process with the parameters specified.
#### Parameters
`isStatic`: If true, window stays in place.  
`noBorder`: If true, window has no visible border.  
`alwaysOnTop`: If true, window is always on top.  
`alwaysOnBottom`: If true, window is always on bottom.  
`width`: Width of window.  
`height`: Height of window.  
`top`: Window position from top.  
`left` Window position to the left.