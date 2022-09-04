const hash = Kernel.extensions.get("hashcat");

// Userspace user parsing library.
// Need seperate one for kernelspace, for security.

Kernel.extensions.load("users", {
  async addUser(user, groups, permLevel, password) {
    const profiles = typeof localStorage.getItem("/etc/passwd") == "string" ? localStorage.getItem("/etc/passwd").split("\n") : [];
    profiles.push(`${user}:${groups.join(",")} ${permLevel} ${await hash.sha512(password)}`);

    localStorage.setItem("/etc/passwd", profiles.join("\n"));
  },
  parseUser(username) {
    const profiles = localStorage.getItem("/etc/passwd").split("\n");
    const profile = profiles.find(i => i.split(":")[0] == username);

    if (!profile) {
      return null;
    }

    const profileSplit = profile.split(" ");

    const groups = profileSplit[0].split(":")[1].split(",");

    return {groups: groups, permLevel: profileSplit[1], hashedPassword: profileSplit[2]};
  }
});