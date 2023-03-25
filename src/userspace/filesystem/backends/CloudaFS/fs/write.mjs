async function write(path, contents, fsIndexes, fsFiles) {
  const pathSplit = splitFilePath(path);

  const pathIndexSearch = await getAllPromise(fsIndexes);
  const fsIndexSearch = await getAllPromise(fsFiles);
  
  const validateParentExists = pathIndexSearch.target.result.find((i) => i.path == pathSplit.directory && i.type == "folder");
  const validateNotAlreadyExists = pathIndexSearch.target.result.find((i) => i.path == path && i.type == "file");

  const fsKey = fsIndexSearch.target.result.find((i) => i.path == path);

  if (!validateParentExists) throw new Error("Parent directory does not exist!");

  const indexIncrement = validateNotAlreadyExists ? validateNotAlreadyExists.index : pathIndexSearch.target.result.length + 1;
  const filesIncrement = validateNotAlreadyExists ? fsKey.index : fsIndexSearch.target.result.length + 1;

  fsIndexes.put({
    index: indexIncrement,
    type: "file",
    path: path,
    owner: "tbd"
  });

  fsFiles.put({
    index: filesIncrement,
    path: path,
    contents: contents
  });
}