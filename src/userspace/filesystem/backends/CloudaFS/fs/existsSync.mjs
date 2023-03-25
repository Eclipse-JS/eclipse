async function existsSync(path, typeOf, fsIndexes) {
  const typeOfBool = typeOf == "file";
  const typeOfFixed = typeOfBool ? "file" : "folder";

  const pathIndexSearch = await getAllPromise(fsIndexes);
  const findElem = pathIndexSearch.target.result.find((i) => i.path == path && i.type == typeOfFixed);

  return Boolean(findElem); // Convert result to boolean for sanitization and for cleanliness
  // TODO fix code comment spelling because I can't spell
}