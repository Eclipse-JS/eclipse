function fillText(text, count) {
  ctx.font = fontSize + "px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(
    text,
    2,
    (fontSize * (count + count * 0.5)) - 4
  );
}

function redraw(textData) {
  const maxLines = Math.round((window.innerHeight/fontSize)/1.5);
  const text = textData.split("\n").map(item => item === undefined || item == "" ? ' ' : item);

  while (text.length > maxLines) text.shift();

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (var i = 1; i < maxLines+1; i++) {
    if (!text[i-1]) break;

    fillText(text[i-1], i);
  }
}