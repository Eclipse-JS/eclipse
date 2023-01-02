/**
 * Logs out information you put in.
 * @param  {...any} args Arguments to log
 */
function log(...args) {
  if (!hasWindowServerStarted) input.stdout(args.join(" ") + "\n");
  console.log(args.join(" "));
}

/**
 * Logs out information you put in, without a new line.
 * @param  {...any} args Arguments to log
 */
function logf(...args) {
  if (!hasWindowServerStarted) input.stdout(args.join(" "));
  console.log(args.join(" "));
}