if (name == "genkernel") return;

if (name == "users" && account.permLevel != 0) {
  const user = Kernel.extensions.get(name);

  return { parseUser: user.parseUser };
}

return Kernel.extensions.get(name, function () {
  return account;
});
