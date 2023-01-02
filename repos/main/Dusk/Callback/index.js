function duskCallback(e) {
  qb.enableRegularRequire();
  require("./GenerateUI.js");

  if (e.event == "WindowUpdate") {
    const xy = e.details.fetchWindowSize().xy;
    const wh = e.details.fetchWindowSize().wh;
    
    return generateUI(...xy, ...wh);
  }
}