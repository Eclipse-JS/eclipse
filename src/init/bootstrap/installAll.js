for (const index of Object.keys(data.packages)) {
  indexes++;

  const percent = ((indexes-2)/Object.keys(data.packages).length)*100;
  fillText(index + " (~" + Math.floor(percent) + "% complete)");

  const script = "UWU;;\n\n" + await fetchTextData("repos/coreutils/" + data.packages[index].path);
  VFS.write("/bin/" + index, script);
}