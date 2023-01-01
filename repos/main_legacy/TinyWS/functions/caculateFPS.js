// Calculates the FPS in milliseconds
function calcFPS(fps) {
  if (fps % 30 == 0) {
    return fps/30 * 33.3;
  }

  console.warn("WARNING: Using very innacurate calculation method. Please use a multiple of 30 instead.");

  const fpsStr = `${fps}`;

  const newFPS = (parseInt(fpsStr) + parseInt(fpsStr[0]) + parseInt(fpsStr[0]))/100;
  return newFPS;
}