const find = extensions.find((val) => val.name == name);

if (typeof find == "object" && find.length != 0) {
  throw "Extension already loaded!";
}

extensions.push({
  name: name,
  data: data,
  isGenFunction: isGenFunction ? true : false,
});
