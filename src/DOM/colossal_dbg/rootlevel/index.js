function test(text, callback) {
  console.log("RUNNING: %s", text);

  try {
    const result = callback();

    if (result) {
      console.log("PASS: %s", text);
    } else {
      console.log("FAIL: %s", text);
    }
  } catch (e) {
    console.log("FAIL: %s", text);
  }
}

test("Ensure that assert with true doesn't crash the kernel", function() {
  return Kernel.kernelLevel.assert(true);
});

test("Ensure that fetching an extension doesn't bug out", function() {
  return Kernel.extensions.get("kjflkjdsfflkjdsflkjdslkjffslkjlkdf");
})

test("Ensure that you can actually load the framebuffer", function() {
  return Kernel.display.getFramebuffer();
});