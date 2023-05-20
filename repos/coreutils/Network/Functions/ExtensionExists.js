async function extensionExists(name) {
  try {
    await Kernel.extensions.get(name);
    return true;
  } catch (e) {
    return false;
  }
}