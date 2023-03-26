const hash = await Kernel.extensions.get("hashcat");

// Userspace user parsing library.

if (!localStorage.getItem("/etc/passwd")) {
  localStorage.setItem("/etc/passwd", "!--v2\n\n")
}

Kernel.extensions.load("users", {
  async addUser(user, groups, permLevel, password, homeDir) {
    const profiles = typeof localStorage.getItem("/etc/passwd") == "string" ? localStorage.getItem("/etc/passwd").split("\n") : [];
    profiles.push(`${user}:${groups.join(",")} ${await hash.sha512(password)}:${permLevel} ${typeof homeDir == "string" ? homeDir : `/home/${user}`}`);

    localStorage.setItem("/etc/passwd", profiles.join("\n"));
  },
  parseUser(username) {
    if (!localStorage.getItem("/etc/passwd").startsWith("!--v2")) {
      Kernel.kernelLevel.panic("Configuration not valid, panicing.", "Extension::Users");
      return new Error("Not a valid or latest configuration. Try reinstalling the OS");
    }

    const profiles = localStorage.getItem("/etc/passwd").split("\n");
    const profile = profiles.find(i => i.split(":")[0] == username);

    if (!profile) {
      return null;
    }

    const profileSplit = profile.split(" ");

    const groups = profileSplit[0].split(":")[1].split(",");
    const pwdData = profileSplit[1].split(":");

    return {groups: groups, homeDir: profileSplit[2], permLevel: pwdData[1], hashedPassword: pwdData[0]};
  }
});