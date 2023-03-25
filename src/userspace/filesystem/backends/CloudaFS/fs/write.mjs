async function write(path, contents, fsIndexes, fsFiles) {
  const pathSplit = splitFilePath(path);

  const pathIndexSearch = await getAllPromise(fsIndexes);
  const validateParentExists = pathIndexSearch.target.result.find((i) => i.path == pathSplit.directory && i.type == "folder");

  const fsIndexSearch = await getAllPromise(fsFiles);

  if (!validateParentExists) {
    console.log(validateParentExists);
    throw new Error("Parent directory does not exist!");
  }
  
  fsIndexes.put({
    index: pathIndexSearch.target.result.length + 1,
    type: "file",
    path: path,
    owner: "tbd"
  });

  fsFiles.put({
    index: fsIndexSearch.target.result.length + 1,
    path: path,
    contents: contents
  });
}