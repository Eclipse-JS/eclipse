function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

while (true) {
  kernel.stdout("jsKernelReq$cls");
  kernel.stdout("pid    name\n");

  for (data of kernel.plist()) {
    kernel.stdout(data[1], "    ", data[0], "\n");
  }
  await sleep(900);
}
