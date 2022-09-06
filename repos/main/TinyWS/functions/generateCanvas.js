function generateCanvas(width, height) {
  if (!document || !document.createElement) {
    throw new Error("TinyWS PANIC!! createElement is undefined");
  }

  const elem = document.createElement("canvas");
  elem.width = width;
  elem.height = height;

  return elem;
}