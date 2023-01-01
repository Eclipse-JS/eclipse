class TextLabel {
  // Recommended template v2.
  constructor(text, x, y, params) {
    this.pos = {
      x: x,
      y: y
    };

    this.text = text;
    this.fontSize = 12;
    this.fontFamily = "system-ui";

    this.drawItems = params.drawItems;

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "text",

      text: this.text,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      objRef: this.objRef,
      pos: this.pos
    });
  }

  #fetchDefaultConfiguration() {
    return {
      type: "text",

      text: this.text,
      
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      objRef: this.objRef,
      pos: this.pos
    };
  }

  #update() {
    if (this.#isRemoved()) return;
    
    const contents = this.#fetchDefaultConfiguration();

    const item = this.drawItems.find(i => i.objRef == this.objRef);
    this.drawItems.splice(this.drawItems.indexOf(item), 1, contents);
  }

  #isRemoved() {
    // Yes, this is pointless. I don't care.
    if (this.removed) {
      console.warn("%s: This is a removed item and will not work!", this.objRef);
      return true;
    }

    return false;
  }

  remove() {
    if (this.#isRemoved()) return;
    
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

    this.#update();
  }

  updateText(text) {
    this.text = typeof text == "string" ? text : this.text;

    this.#update();
  }

  updateTextStyle(fontSize, fontFamily) {
    this.fontSize = typeof fontSize == "string" ? fontSize : this.textStyle;
    this.fontFamily = typeof fontFamily == "string" ? fontFamily : this.textStyle;

    this.#update();
  }
}