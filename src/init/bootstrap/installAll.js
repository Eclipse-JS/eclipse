for (const index of Object.keys(data.packages)) {
  if (index == "dttysh") continue;

  if (index == "ttysh" && Deno) {
    const script = "UWU;;\n\n" + await fetchTextData("repos/coreutils/" + data.packages["dttysh"].path);
    VFS.write("/bin/ttysh", script);

    continue;
  }

  indexes++;
  fillText(" - " + index, indexes);

  const script = "UWU;;\n\n" + await fetchTextData("repos/coreutils/" + data.packages[index].path);
  VFS.write("/bin/" + index, script);

  const percent = ((indexes-2)/Object.keys(data.packages).length)*100;

  Sys.loadPercent(percent);
}