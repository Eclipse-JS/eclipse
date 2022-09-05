const fs = require("fs")
const compile = require("@creamy-dev/qbuild");

console.log("Removing old directories...\n");

if (fs.existsSync("../out")) {
  fs.rmSync("../out", { recursive: true, force: true });
}

console.log("Compiling kernel...\n");

const mainProj = JSON.parse(fs.readFileSync("../build.json", "utf-8"));

for (const i of mainProj.projects) {
  console.log("Compiling '%s' -> '%s'", i.path, i.out);

  // Fix for a bug that I'm too lazy to fix (for now)
  // TODO: Fix my goddamn code

  const data =
    typeof i.type == "string" && i.type == "static"
      ? fs.readFileSync("." + i.path)
      : compile("." + i.path);
  
  const fixMyCode = "." + i.out;
  const dirPath = fixMyCode.split("/");

  dirPath.pop();

  try {
    fs.mkdirSync(dirPath.join("/"), { recursive: true });
  } catch (e) {
    console.warn("WARN <Step::Mkdir>:", e);
  }

  try {
    fs.writeFileSync(fixMyCode, data);
  } catch (e) {
    console.error("ERR <Step::Write>:", e);
  }
}


console.log("\nBuilding repo lists...\n");
fs.mkdirSync("../out/repos");

console.log("Reading './repos/rootpkgserver.json'...");
const file = fs.readFileSync("../repos/rootpkgserver.json", "utf-8");
console.log("Copying file './repos/rootpkgserver.json' -> '../out/repos/rootpkgserver.json'...");
fs.writeFileSync("../out/repos/rootpkgserver.json", file);

for (const contents of JSON.parse(file).contents) {
  const rootDir = "../repos/" + contents.path.replace("packages.json", ""); // Evil hack
  const destDir = "../out/repos/" + contents.path.replace("packages.json", "");

  console.log("Fetching and copying '%s' -> '%s'...", rootDir + "packages.json", destDir + "packages.json");

  const folder = ("../out/repos/" + contents.path).split("/");
  folder.pop();

  fs.mkdirSync(folder.join("/"), { recursive: true });

  const file = fs.readFileSync("../repos/" + contents.path, "utf-8");
  const fileParsed = JSON.parse(file);

  fs.writeFileSync("../out/repos/" + contents.path, file);

  let reformedFile = {packages:{}};

  for (const i of Object.keys(fileParsed.packages)) {
    const item = fileParsed.packages[i];

    reformedFile[i] = {
      ver: item.ver,
      path: item.path
    }

    if (typeof item.compilerOpts == "object") {
      const opts = item.compilerOpts;
      
      if (!opts.src) {
        console.error("ERR: '%s' is an invalid file!", rootDir + item.path);
        continue;
      }

      if (opts.static) {
        console.log("Copying '%s' -> '%s'...", rootDir + item.path, item.path);

        fs.copyFileSync(rootDir + opts.src, destDir + opts.src);
        continue;
      } else {
        console.log("Building '%s' -> '%s'...", rootDir + opts.src, destDir + item.path);
        const build = compile(rootDir + opts.src);
        
        fs.writeFileSync(destDir + item.path, build);
      }
    } else {
      console.log("Copying '%s' -> '%s'...", rootDir + item.path, destDir + item.path);

      const read = fs.readFileSync(rootDir + item.path, "utf-8");
      fs.writeFileSync(destDir + item.path, read);
    }
  }
}