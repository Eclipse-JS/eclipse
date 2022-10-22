/**
 * Measures width and height of a string with new lines 
 * @param {string || object} i Text to measure
 * @returns {object} width: Number, height: Number
 */
function measureFullText(i) {
  const text = typeof i == "string" ? i.split("\n") : i;
  const size = {
    width: 0,
    height: 0
  }

  const magicNum = 8; // Offset for the height. Guessed using the monospace font of Firefox on Windows 10.

  for (i of text) {
    const measureResult = ctx.measureText(i);
    if (measureResult.width > size.width) size.width = measureResult.width;

    size.height += measureResult.actualBoundingBoxAscent + measureResult.actualBoundingBoxDescent + magicNum; // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
  }

  return size;
}

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

  for (i of rawText) {
    if (ctx.measureText(i).width > canvasElement.width) {
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

  while (measureFullText(text).height > canvasElement.height) text.shift();

  for (var i = 1; i < maxLines+1; i++) {
    if (!text[i-1]) break;

    fillText(text[i-1], i);
  }
}