async function readDir(pathDirty, fsIndexes) {
  const path = pathDirty == "/" ? "/" : sanitizeDirectorySplit(pathDirty);

  const pathIndexSearch = await getAllPromise(fsIndexes);
  const findExistingElem = pathIndexSearch.target.result.filter((i) => splitFilePath(i.path).directory == path);

  // Map to sanitize items,
  // Then filter to remove the resulting undefined items potentially created
  // FIXME...?
  return findExistingElem.map((i) => i.path == path ? undefined : i.path).filter(e => e);
}