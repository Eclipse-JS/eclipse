// Calculates the FPS in milliseconds
function calcFPS(fps) {
  const fpsStr = `${fps}`;

  const newFPS = (parseInt(fpsStr) + parseInt(fpsStr[0]) + parseInt(fpsStr[0]))/100;
  return newFPS;
}