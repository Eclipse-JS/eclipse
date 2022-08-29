// Initialize the canvas
const canvas = Kernel.display.getFramebuffer();

// Read config file
const config = VFS.read("/etc/ttysh.conf").split("\n");
const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];

console.log(shell);