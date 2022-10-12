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
  const maxLines = Math.round((canvasElement.height/fontSize)/1.5);
  const maxChars = Math.round((canvasElement.width/fontSize)*1.75);
  
  ctx.fillStyle = theme.styles.general.background["foreground-color"];
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  const rawText = textData.split("\n").map(item => item === undefined || item == "" ? ' ' : item);
  let text = [];

  while (text.length > maxLines) text.shift(); // Avoid over processing data

  for (i of rawText) {
    if (i.length > maxChars) {
      const overLength = Math.floor(i.length / maxChars);

      for (var j = 1; j <= overLength; j++) {
        const str = i.slice(0, maxChars*j);
      
        if (j == 1) text.push(str);
        text.push(i.replace(str, ""));
      }
    } else {
      text.push(i);
    }
  }

  for (var i = 1; i < maxLines+1; i++) {
    if (!text[i-1]) break;

    fillText(text[i-1], i);
  }
}