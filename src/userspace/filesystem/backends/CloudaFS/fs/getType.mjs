async function getType(path, fsIndexes) {
  const pathIndexSearch = await getAllPromise(fsIndexes);
  const findElem = pathIndexSearch.target.result.find((i) => i.path == path);

  if (!findElem) throw new Error("Item does not exist!");
  return findElem.type;
}