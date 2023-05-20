function splitFilePath(path) {
  const lastSlashIndex = path.lastIndexOf('/');

  const dirSplit = path.substring(0, lastSlashIndex);
  const fileSplit = path.substring(lastSlashIndex + 1);

  return {
    directory: dirSplit == "" ? "/" : dirSplit,
    file: fileSplit
  };
}

function sanitizeDirectorySplit(path) {
  if (path.endsWith("/")) return path.substring(0, path.length-1);
  return path;
}