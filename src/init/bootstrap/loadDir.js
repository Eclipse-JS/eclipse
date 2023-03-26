if (!(await VFS.exists("/home", "folder"))) await VFS.mkdir("/home");
if (!(await VFS.exists("/root", "folder"))) await VFS.mkdir("/root");
if (!(await VFS.exists("/etc", "folder"))) await VFS.mkdir("/etc");
if (!(await VFS.exists("/usr", "folder"))) await VFS.mkdir("/usr");
if (!(await VFS.exists("/bin", "folder"))) await VFS.mkdir("/bin");