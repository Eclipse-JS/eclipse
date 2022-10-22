class TextLabel {
  constructor(text, x, y, params) {
    this.pos = {
      x: x,
      y: y
    };

    this.textStyle = "12px system-ui";

    this.text = text;
    this.drawItems = params.drawItems;

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "text",

      text: this.text,
      textStyle: this.textStyle,

      objRef: this.objRef,
      pos: this.pos
    });
  }

  update(newContents) {
    const item = this.drawItems.find(i => i.objRef == this.objRef);
    this.drawItems.splice(this.drawItems.indexOf(item), 1, newContents);
  }

  updatePos(x, y) {
    this.pos = {
      x: typeof x == "number" ? x : this.pos.x, 
      y: typeof y == "number" ? x : this.pos.y
    }

    this.update({
      type: "text",

      text: this.text,
      textStyle: this.textStyle,

      objRef: this.objRef,
      pos: this.pos
    });
  }

  updateText(text) {
    this.text = typeof text == "string" ? text : this.text;

    this.update({
      type: "text",

      text: this.text,
      textStyle: this.textStyle,

      objRef: this.objRef,
      pos: this.pos
    });
  }

  updateTextStyle(newStyle) {
    this.textStyle = typeof newStyle == "string" ? newStyle : this.textStyle;

    this.update({
      type: "text",

      text: this.text,
      textStyle: this.textStyle,

      objRef: this.objRef,
      pos: this.pos
    });
  }
}