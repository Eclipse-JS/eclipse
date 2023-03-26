if (!extensions.find(val => val.name == name)) {
  throw "Extension '" + name + "' not loaded!";
}

const extFind = extensions.find(val => val.name == name);

if (extFind.isGenFunction) {
  return await extFind.data(...params);
} else {
  return extFind.data;
}