{
  stdout: function(text) {
    if (text == "$c:clear") {
      textfb = "";
    } else {
      textfb += text;
    }

    redraw(textfb);
  },
  
  stdin: async function() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // TODO: Make custom API as a service or a kernel for this.
    inputIsActive = true;

    while (inputIsActive) await sleep(100);

    const input = inputfb;
    inputfb = "";

    this.stdout(input + "\n");

    return input;
  }
}