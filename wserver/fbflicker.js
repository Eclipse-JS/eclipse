try {
  kernel.fb.fbMode();

  let x = kernel.fb.getFB();

  x.strokeStyle = "red";
  x.lineWidth = 0;

  x.fillStyle = "#9ea7b8";
  x.fillRect(0, 0, screen.width, screen.height);

  x.strokeText("hello world", 0, 10);

  await sleep(1000);
  kernel.fb.textMode();
} catch (e) {
  console.error(e);
}
