class Button {
  // Recommended template v2.
  constructor(text, x, y, params) {
    this.pos = {
      x: x,
      y: y
    };

    this.textPadding = 4;

    this.text = text;
    this.fontSize = 12;
    this.fontFamily = "system-ui";

    this.drawItems = params.drawItems;
    this.addEventListener = params.evtListener;

    this.renderOffset = "top";

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "button",
      subtype: "standard",

      text: this.text,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      textPadding: this.textPadding,

      isPressed: this.isPressed ? this.isPressed : false,

      renderOffset: this.renderOffset,

      objRef: this.objRef,
      pos: this.pos
    });

    const self = this;

    this.addEventListener("mousedown", function(e) {
      if (self.isRemoved()) return;

      /**
       * Calculates if mouse is colliding in an rectangle.
       * Blood sweat and tears went into figuring out what my window manager did to do this.
       * If I have to read that code one more time, I am personally going to lose it.
       *
       * @param {object} mousePos Position (in this case, mouse) in an array. Example: [x, y].
       * @param {object} barPos Rectangle position in an array. Example: [x, y].
       * @param {object} barSize Rectangle size in an array. Example: [width, height].
       *
       * @returns {boolean} True or false if object is colliding.
       */
      function isColliding(mousePos, barPos, barSize) {
        if (
          (mousePos[0] >= barPos[0] && mousePos[0] <= barPos[0] + barSize[0])
          &&
          (mousePos[1] >= barPos[1] && mousePos[1] <= barPos[1] + barSize[1])
        ) {
          return true;
        }

        return false;
      }

      const mousePos = [e.clientX, e.clientY];
      const barPos = [self.pos.x, self.pos.y];
      const barSize =[self.pos.w, self.pos.h];

      // We're running as root, so this should be fine...?
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      ctx.font = self.fontSize + "px " + self.fontFamily;

      const textWidth = ctx.measureText(self.text).width + (self.textPadding * 2); // Account for padding * 2, for up and down.
      const textHeight = self.fontSize + (self.textPadding * 2);

      barSize.push(textWidth, textHeight);

      const offset = offsetify({renderOffset:self.renderOffset}, ...barPos, ...barSize);
      const collisionCheck = isColliding(mousePos, ...offset);

      if (collisionCheck) {
        self.isPressed = true;
        self.update();

        if (typeof self.onclick == "function") self.onclick();
      }
    });

    this.addEventListener("mouseup", function() {
      if (self.isRemoved()) return;

      if (self.isPressed) {
        self.isPressed = false;
        self.update();
      }
    })
  }

  #fetchDefaultConfiguration() {
    return {
      type: "button",
      subtype: "standard",

      text: this.text,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      textPadding: this.textPadding,

      isPressed: this.isPressed ? this.isPressed : false,

      renderOffset: this.renderOffset,

      objRef: this.objRef,
      pos: this.pos
    };
  }

  update() {
    if (this.isRemoved()) return;

    const contents = this.#fetchDefaultConfiguration();

    const item = this.drawItems.find(i => i.objRef == this.objRef);
    this.drawItems.splice(this.drawItems.indexOf(item), 1, contents);
  }

  isRemoved() {
    // Yes, this is pointless. I don't care.
    if (this.removed) {
      console.warn("%s: This is a removed item and will not work!", this.objRef);
      return true;
    }

    return false;
  }

  remove() {
    if (this.isRemoved()) return;

    this.removed = true;

    const item = this.drawItems.find(i => i.objRef == this.objRef);
    this.drawItems.splice(this.drawItems.indexOf(item), 1);
  }

  // Fetches recommended base version
  // Not required to implement, but it helps users tell what underlying style they're dealing with.

  fetchBaseVersion() {
    return 2;
  }

  updatePos(x, y) {
    this.pos = {
      x: typeof x == "number" ? x : this.pos.x,
      y: typeof y == "number" ? x : this.pos.y
    }

    this.update();
  }

  updateText(text) {
    this.text = typeof text == "string" ? text : this.text;

    this.update();
  }

  updateTextPadding(px) {
    this.textPadding = typeof px == "number" ? px : this.textPadding;

    this.update();
  }

  updateTextStyle(fontSize, fontFamily) {
    this.fontSize = typeof fontSize == "string" ? fontSize : this.textStyle;
    this.fontFamily = typeof fontFamily == "string" ? fontFamily : this.textStyle;

    this.update();
  }

  updateClickEvent(func) {
    this.onclick = func;
  }

  invertRenderOffset(opt) {
    this.renderOffset = typeof opt == "string" ? opt : this.renderOffset;
    this.update();
  }
}