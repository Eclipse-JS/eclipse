if (extensions.find(val => val.name == name).length == 0) {
  throw "Extension not loaded!";
}

const extFind = extensions.find(val => val.name == name);

if (extFind.isGenFunction) {
  const data = extFind.data(...params);
  return data;
} else {
  return extFind.data;
}