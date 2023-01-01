function extensionExists(name) {
  try {
    Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}