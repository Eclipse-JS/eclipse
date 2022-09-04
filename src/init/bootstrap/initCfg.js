VFS.write("/etc/init.d/init.conf", "/bin/net");
VFS.write("/etc/init.d/initcmd.txt", "/bin/ttysh");
VFS.write("/etc/ttysh.conf", "shell=/bin/login");

VFS.write("/etc/motd", `
_______      _ _                   _____    _    
(_______)    | (_)                 / ___ \\  | |   
 _____   ____| |_ ____   ___  ____| |   | |  \\ \\  
|  ___) / ___) | |  _ \ /___)/ _  ) |   | |   \\ \\ 
| |____( (___| | | | | |___ ( (/ /| |___| |____) )
|_______)____)_|_| ||_/(___/ \\____)\\_____(______/ 
                 |_|                              

Tip: The default username is anon, and the password is anonymous.
The root password is toor. ;-)

`)