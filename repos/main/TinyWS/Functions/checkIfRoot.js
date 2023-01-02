function isRoot() {
  // If we have permission level 0, we are effectively root

  return Kernel.accounts.getCurrentInfo().permLevel == 0;
}