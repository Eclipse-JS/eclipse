if (!extensions.find(val => val.name == name)) {
  throw "Extension not loaded!";
}

const extFind = extensions.find(val => val.name == name);

if (extFind.isGenFunction) {
  return extFind.data(...params);
} else {
  return extFind.data;
}