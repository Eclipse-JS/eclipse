{
  stdout: function(text) {
    if (text == "$c:clear") {
      textfb = "";
    } else {
      textfb += text;
    }

    redraw(textfb);
    container.scrollTo(0, container.scrollHeight);
  },
  
  stdin: async function() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    inputIsActive = true;

    while (inputIsActive) await sleep(100);

    const input = inputfb;
    inputfb = "";

    this.stdout(input + "\n");

    return input;
  }
}