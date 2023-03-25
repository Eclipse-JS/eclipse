async function mkdir(pathDirty, fsIndexes, userData) {
  const path = pathDirty == "/" ? "/" : sanitizeDirectorySplit(pathDirty);
  const pathSplit = splitFilePath(path);

  const pathIndexSearch = await getAllPromise(fsIndexes);
  const findExistingElem = pathIndexSearch.target.result.find((i) => i.path == path && i.type == "folder");
  const findSubdirectoryElem = pathIndexSearch.target.result.find((i) => i.path == pathSplit.directory && i.type == "folder");

  if (findExistingElem) throw new Error("Directory already exists!");
  if (!findSubdirectoryElem && path != "/") {
    throw new Error("Previous directory does not exist!");
  };

  if (findExistingElem) {
    if (findExistingElem.owner != userData().username && userData().permLevel != 0) {
      throw "No permission!";
    }
  }

  fsIndexes.put({
    index: pathIndexSearch.target.result.length + 1,
    type: "folder",
    path: path,
    owner: userData().username
  });
}