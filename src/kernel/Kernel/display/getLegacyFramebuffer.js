assert(document.getElementById("framebuffer"), "No framebuffer detected!");

if (
  document.getElementById("framebuffer").width != screen.availWidth ||
  document.getElementById("framebuffer").height != screen.availHeight
) {
  document.getElementById("framebuffer").width = window.innerWidth;
  document.getElementById("framebuffer").height = window.innerHeight;
}

return document.getElementById("framebuffer").getContext("2d");
