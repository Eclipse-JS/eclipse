const keysToIgnore = [
  "Control",
  "Alt",
  "WakeUp",
  "Meta",
  "OS",
  "Page",
  "Arrow",
  "Shift",
  "Escape",
  "CapsLock",
  "Tab",
  "Home",
  "End",
  "Insert",
  "Delete",
  "Unidentified",
  "F1",
  "F2",
  "F0",
  "ContextMenu",
  "AudioVolumeDown",
  "AudioVolumeUp",
];

class InputField {
  // Recommended template v2.
  constructor(x, y, w, h, params) {
    this.pos = {
      x: x,
      y: y,
      w: w,
      h: h
    };

    this.textPadding = 4;

    this.text = "";
    this.fontSize = 12;
    this.fontFamily = "system-ui";

    this.drawItems = params.drawItems;
    this.addEventListener = params.evtListener;

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "input",

      text: this.text,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      textPadding: this.textPadding,

      isPressed: this.isPressed ? this.isPressed : false,

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

      const collisionCheck = isColliding(mousePos, barPos, barSize);

      self.doNotEverUseThisPleaseISwearToGod(collisionCheck);
      self.update();
    });

    this.addEventListener("keydown", function(e) {
      if (!self.isPressed) return;
      
      if (keysToIgnore.includes(e.key)) return;
      if (e.key == "Enter") self.doNotEverUseThisPleaseISwearToGod(false);

      let text = self.text;

      if (e.key == "Backspace") {
        text = text.slice(0, -1);
      } else {
        text += e.key;
      }
      
      self.doNotEverUseThisPleaseISwearToGod(text, "text");

      self.update();
     });
  }

  // Absolute evil hack
  doNotEverUseThisPleaseISwearToGod(updateState, updateType) {
    if (updateType == "text") {
      this.text = updateState;
      return;
    }

    this.isPressed = typeof updateState == "boolean" ? updateState : this.isPressed;
  }

  #fetchDefaultConfiguration() {
    return {
      type: "input",

      text: this.text,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      textPadding: this.textPadding,

      isPressed: this.isPressed ? this.isPressed : false,

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
      y: typeof y == "number" ? x : this.pos.y,
      w: this.pos.w,
      h: this.pos.h
    }

    this.update();
  }

  updateSize(w, h) {
    this.pos = {
      x: this.pos.x,
      y: this.pos.y,
      w: typeof w == "number" ? w : this.pos.w,
      h: typeof h == "number" ? h : this.pos.w
    }

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
}