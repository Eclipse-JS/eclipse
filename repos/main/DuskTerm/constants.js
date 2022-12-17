qb.enableRegularRequire();

const VFS = Kernel.extensions.get("Vfs");

const config = VFS.read("/etc/ttysh.conf").split("\n");
const shell = "/bin/sh";
//const shell = config.filter(item => item.startsWith("shell="))[0].split("=")[1];

const fontSize = 14;
