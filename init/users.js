const vfs = Kernel.extensions.get("Vfs");
const hash = Kernel.extensions.get("hashcat");

// Userspace user parsing library.
// Need seperate one for kernelspace, for security.

Kernel.extensions.load("users", {
  addUser(user, groups, password, permLevel) {
    const profiles = vfs.existsSync("/etc/passwd", "file") ? vfs.read("/etc/passwd").split("\n") : [];
    profiles.push(`${user}:${groups.join(",")} ${permLevel} ${hash.sha512(password)}`);

    vfs.write("/etc/passwd", profiles.join("\n"));
  },
  parseUser(username) {
    const profile = vfs.read("/etc/passwd").split("\n").find(i => i.split(":")[0] == username);
    const profileSplit = profile.split(" ");

    const groups = profileSplit[0].split(":")[1].split(",");

    return {groups: groups, permLevel: profileSplit[1], hashedPassword: profileSplit[2]};
  }
});