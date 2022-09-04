if (account.permLevel != 0) {
  throw "You must have permission level 0!";
}

return Kernel.extensions.load(name, data, isGenFunction);