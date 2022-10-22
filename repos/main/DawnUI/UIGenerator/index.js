qb.enableRegularRequire();

class UIGenerator {
  constructor(canvas, addEventListener) {
    if (!canvas instanceof HTMLCanvasElement) {
      throw "Not a raw canvas element.";
    }

    this.drawItems = [];

    this.canvas = canvas;
    this.evtListener = typeof addEventListener == "function" ? addEventListener : Kernel.proxies.addEventListener;

    // Nothing works for me today. - @greysoh 10/22/2022
    function redraw(self) {
      const ctx = self.canvas.getContext("2d");
      const currentTheme = handler.themes.getTheme(handler.themes.getDefaultTheme());

      console.log(self.canvas, self.canvas.width, self.canvas.height);

      ctx.fillStyle = currentTheme.styles.general.background["foreground-color"];
      ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
  
      for (i of self.drawItems) {
        if (i.type == "text") {
          ctx.font = "12px system-ui";
          ctx.fillStyle = currentTheme.styles.general.accents.white["background-color"];
  
          ctx.fillText(i.text, i.pos.x, i.pos.y);
        }
      }
    }

    // Hijack draw items for sanity
    const self = this; // fucking fuck fuck fuck fuck fuck ballsack I AM GOUING TO LOSE IT askjlhfdklasjflkjsdfjm

    this.drawItems.push = function() {
      Array.prototype.push.apply(this, arguments);
      redraw(self);
    }

    this.drawItems.slice = function() {
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
}