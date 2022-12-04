const ws = Kernel.extensions.get("WindowServer");

const vid = document.createElement("video");

vid.src = "http://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv";
vid.controls = false;
vid.muted = false;

vid.addEventListener("loadedmetadata", async function() {
  await ws.createWindow(vid.videoWidth, vid.videoHeight, async function (canvasElement, update, addEventListener, removeEventListener) {
    canvasElement.title = "LibVideoplay";
    update();
  
    const ctx = canvasElement.getContext("2d");
  
    vid.addEventListener("play", function() {
      (function loop() {
        if (!vid.paused && !vid.ended) {
          ctx.drawImage(vid, 0, 0);
          setTimeout(loop, 1000 / 30);
        }
      })();
    });
  
    vid.play();
  
    while (!vid.ended) {
      await new Promise(i => setTimeout(i, 100));
    }
  });
})