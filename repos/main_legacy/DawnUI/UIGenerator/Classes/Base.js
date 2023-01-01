// Do not use! This is just a template, based on TextLabel (template v1).

class BaseTemplate {
  // Recommended template v2.
  constructor(data, x, y, params) {
    this.pos = {
      x: x,
      y: y
    };

    this.someData = data;
    this.drawItems = params.drawItems;

    this.objRef = uuidv4();
    this.drawItems.push({
      type: "amogus",

      someData: this.someData,

      objRef: this.objRef,
      pos: this.pos
    });
  }

  #fetchDefaultConfiguration() {
    return {
      type: "amogus",

      someData: this.someData,

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

  // Modifiable code below.
  // Then again, you can modify above alot. I'm not judging. (yet) :3

  updatePos(x, y) {
    this.pos = {
      x: typeof x == "number" ? x : this.pos.x, 
      y: typeof y == "number" ? x : this.pos.y
    }

    this.#update();
  }

  updateSomeData(data) {
    this.someData = typeof data == "string" ? data : this.someData;

    this.#update();
  }
}