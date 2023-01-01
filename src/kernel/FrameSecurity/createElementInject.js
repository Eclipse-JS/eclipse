function createElementInject(...argv) {
  document.createElement32 = elemCreate;
  const element = document.createElement32(...argv);

  document.createElement32 = null;
  return element;
}
