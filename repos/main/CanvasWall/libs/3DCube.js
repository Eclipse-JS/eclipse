// Code based off of https://www.youtube.com/watch?v=gx_Sx5FeTAk
// I'm too lazy for math.

function render3DCube(ctx, w, h) {
  const bgColor = "black";
  const cubeColor = "yellow";
  const xSpeed = 0.05; // rps
  const ySpeed = 0.15; // rps
  const zSpeed = 0.1; // rps

  class POINT3D {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = cubeColor;
  ctx.lineWidth = w / 100;
  ctx.lineCap = "round";

  // cube parameters
  const cx = w / 2;
  const cy = h / 2;
  const cz = 0;
  const size = h / 4;
  const vertices = [
    new POINT3D(cx - size, cy - size, cz - size),
    new POINT3D(cx + size, cy - size, cz - size),
    new POINT3D(cx + size, cy + size, cz - size),
    new POINT3D(cx - size, cy + size, cz - size),
    new POINT3D(cx - size, cy - size, cz + size),
    new POINT3D(cx + size, cy - size, cz + size),
    new POINT3D(cx + size, cy + size, cz + size),
    new POINT3D(cx - size, cy + size, cz + size),
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // front face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // connecting sides
  ];

  // set up the animation loop
  var timeDelta,
    timeLast = 0;
  const loopID = requestAnimationFrame(loop);

  function loop(timeNow) {
    // calculate the time difference
    timeDelta = timeNow - timeLast;
    timeLast = timeNow;

    // background
    ctx.fillRect(0, 0, w, h);

    // rotate the cube along the z axis
    let angle = timeDelta * 0.001 * zSpeed * Math.PI * 2;
    for (const v of vertices) {
      let dx = v.x - cx;
      let dy = v.y - cy;
      let x = dx * Math.cos(angle) - dy * Math.sin(angle);
      let y = dx * Math.sin(angle) + dy * Math.cos(angle);
      v.x = x + cx;
      v.y = y + cy;
    }

    // rotate the cube along the x axis
    angle = timeDelta * 0.001 * xSpeed * Math.PI * 2;
    for (const v of vertices) {
      let dy = v.y - cy;
      let dz = v.z - cz;
      let y = dy * Math.cos(angle) - dz * Math.sin(angle);
      let z = dy * Math.sin(angle) + dz * Math.cos(angle);
      v.y = y + cy;
      v.z = z + cz;
    }

    // rotate the cube along the y axis
    angle = timeDelta * 0.001 * ySpeed * Math.PI * 2;
    for (const v of vertices) {
      let dx = v.x - cx;
      let dz = v.z - cz;
      let x = dz * Math.sin(angle) + dx * Math.cos(angle);
      let z = dz * Math.cos(angle) - dx * Math.sin(angle);
      v.x = x + cx;
      v.z = z + cz;
    }

    // draw each edge
    for (let edge of edges) {
      ctx.beginPath();
      ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
      ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
      ctx.stroke();
    }

    // call the next frame
    requestAnimationFrame(loop);
  }

  return loopID;
}