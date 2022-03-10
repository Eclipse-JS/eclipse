if (!args[0]) {
  kernel.stdout("Missing 'type' parameter!\n");
  kernel.stdout("Valid types:\n");
  kernel.stdout("play\n");
  kernel.stdout("pause\n");
  kernel.stdout("unpause");
  return;
} else if (!args[1]) {
  kernel.stdout(
    "Missing 'src' parameter!\nPlease provide a path to the audio."
  );
  return;
}

let url = args[1];

if (args[0] == "play") {
  kernel.stdout("Playing '" + url + "'");
  kernel.audio.play(url);
} else if (args[0] == "pause") {
  kernel.stdout("Pausing '" + url + "'");
  kernel.audio.pause(url);
} else if (args[0] == "unpause") {
  kernel.stdout("Unpausing '" + url + "'");
  kernel.audio.unpause(url);
}
