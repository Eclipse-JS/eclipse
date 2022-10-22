class TextLabel {
  constructor(text, x, y, params) {
    this.pos = {
      x: x,
      y: y
    };

    this.text = text;
    this.drawItems = params.drawItems;

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "text",

      text: this.text,

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

      objRef: this.objRef,
      pos: this.pos
    });
  }

  updateText(text) {
    this.text = typeof text == "string" ? text : this.text;

    this.update({
      type: "text",

      text: this.text,

      objRef: this.objRef,
      pos: this.pos
    });
  }
}