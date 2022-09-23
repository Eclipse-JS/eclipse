const args = argv;
const input = args.shift();

function test(text, callback) {
  function log(...str) {
    console.log(...str);
    input.stdout(str.join(" ") + "\n");
  }

  log("RUNNING:", text);

  try {
    const result = callback();

    if (result) {
      log("  [PASS]");
    } else {
      log("  [FAIL]");
    }
  } catch (e) {
    log("  [FAIL]");
  }
}

test("123", function() {
  return true;
});