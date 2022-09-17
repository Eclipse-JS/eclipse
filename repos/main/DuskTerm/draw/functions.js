function fillText(text, count) {
  ctx.font = fontSize + "px monospace";
  ctx.fillStyle = theme.styles.general.accents.white["background-color"];
  ctx.fillText(
    text,
    2,
    (fontSize * (count + count * 0.5)) - 4
  );
}

function redraw(textData) {
  const maxLines = Math.round((canvasElement.width/fontSize)/1.5);
  const text = textData.split("\n").map(item => item === undefined || item == "" ? ' ' : item);

  while (text.length > maxLines) text.shift();

  ctx.fillStyle = theme.styles.general.background["foreground-color"];
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  for (var i = 1; i < maxLines+1; i++) {
    if (!text[i-1]) break;

    fillText(text[i-1], i);
  }
}