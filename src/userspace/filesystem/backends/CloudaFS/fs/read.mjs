async function read(path, fsIndexes, fsFiles) {
  const pathIndexSearch = await getAllPromise(fsIndexes);
  const findElem = pathIndexSearch.target.result.find((i) => i.path == path && i.type == "file");

  if (!findElem) {
    throw new Error("Element does not exist!");
  };

  const filesIndexSearch = await getAllPromise(fsFiles);
  const filesFindElem = filesIndexSearch.target.result.find((i) => i.path == path);

  return filesFindElem.contents;
}