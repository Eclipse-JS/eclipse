console.log(input);

if (input.event == "FetchRequest") {
  if (input.subevent == "genCanvas") return generateCanvas;
}