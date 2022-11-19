qb.enableRegularRequire();

// TODO: Import base class and make everything base on top of that.

class UIGenerator {
  constructor(canvas, addEventListener, removeEventListener) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw "Not a raw canvas element.";
    }

    this.drawItems = [];

    this.canvas = canvas;
    this.evtListener = typeof addEventListener == "function" ? addEventListener : Kernel.proxies.addEventListener;
    this.rmEvtListener = typeof removeEventListener == "function" ? removeEventListener : Kernel.proxies.removeEventListener;

    // Nothing works for me today. - @greysoh 10/22/2022
    function redraw(self) {
      const ctx = self.canvas.getContext("2d");
      const currentTheme = handler.themes.getTheme(handler.themes.getDefaultTheme());

      ctx.fillStyle = currentTheme.styles.general.background["foreground-color"];
      ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
  
      for (const i of self.drawItems) {
        switch (i.type) {
          case "text": {
            ctx.font = i.fontSize + "px " + i.fontFamily;
            ctx.fillStyle = currentTheme.styles.general.accents.white["background-color"];
  
            const text = i.text.split("\n");
  
            for (const j in text) {
              const pos = j != 0 ? i.fontSize + i.pos.y * j : i.pos.y;
  
              ctx.fillText(text[j], i.pos.x, pos);
            }

            break;
          }

          case "button": {
            function offsetify(x, y, w, h) {
              if (i.renderOffset != "top") {
                return [x-w, y-h, w, h];
              } else {
                return [x, y, w, h];
              }
            }
            
            const colorShade = i.isPreassed ? "foreground-color" : "background-color";
            
            ctx.font = i.fontSize + "px " + i.fontFamily;
            ctx.fillStyle = currentTheme.styles.general.background["background-color"];

            const textWidth = ctx.measureText(i.text).width + (i.textPadding * 2);
            const textHeight = i.fontSize + (i.textPadding * 2);

            ctx.fillRect(...offsetify(i.pos.x, i.pos.y, textWidth, textHeight));

            ctx.fillStyle = currentTheme.styles.general.accents.white[colorShade];
            ctx.fillText(...offsetify(i.text, i.pos.x + i.textPadding, i.pos.y + i.fontSize + (i.textPadding / 2)));

            break;
          }

          case "input": {
            const colorShade = i.isPreassed ? "foreground-color" : "background-color";
            
            ctx.fillStyle = currentTheme.styles.general.background["background-color"];
            ctx.fillRect(i.pos.x, i.pos.y, i.pos.w, i.pos.h);

            let text = i.text;

            while (ctx.measureText(text).width + (i.textPadding * 2) > i.pos.w) text = text.substring(1);

            ctx.fillStyle = currentTheme.styles.general.accents.white[colorShade];
            ctx.font = i.fontSize + "px " + i.fontFamily;

            ctx.fillText(text, i.pos.x + i.textPadding, i.pos.y + i.fontSize + (i.textPadding / 2));

            break;
          }
        }
      }
    }

    // Hijack draw items for sanity
    const self = this;

    this.drawItems.push = function() {
      Array.prototype.push.apply(this, arguments);
      redraw(self);
    }

    this.drawItems.splice = function() {
      Array.prototype.push.apply(this, arguments);
      redraw(self);
    }
  }

  textLabel(text, x, y) {
    require("./Classes/TextLabel.js");

    const label = new TextLabel(text, x, y, {
      canvas: this.canvas,
      evtListener: this.evtListener,
      drawItems: this.drawItems
    })

    return label;
  }

  button(text, x, y) {
    require("./Classes/Button.js");

    const button = new Button(text, x, y, {
      canvas: this.canvas,
      evtListener: this.evtListener,
      drawItems: this.drawItems
    });

    return button;
  }

  inputField(x, y, w, h) {
    require("./Classes/InputField.js")

    const inputField = new InputField(x, y, w, h, {
      canvas: this.canvas,
      evtListener: this.evtListener,
      drawItems: this.drawItems
    });

    return inputField;
  }
}