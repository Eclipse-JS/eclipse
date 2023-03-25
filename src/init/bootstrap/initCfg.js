await VFS.write("/etc/init.d/init.conf", "/bin/net");
await VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
await VFS.write("/etc/ttysh.conf", "shell=/bin/setup");

await VFS.write("/etc/motd", `
_______      _ _                   _____    _    
(_______)    | (_)                 / ___ \\  | |   
 _____   ____| |_ ____   ___  ____| |   | |  \\ \\  
|  ___) / ___) | |  _ \ /___)/ _  ) |   | |   \\ \\ 
| |____( (___| | | | | |___ ( (/ /| |___| |____) )
|_______)____)_|_| ||_/(___/ \\____)\\_____(______/ 
                 |_|                              

Tip: The default root password is toor.

`)