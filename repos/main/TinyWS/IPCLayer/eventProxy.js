const validItems = ["keypress", "keydown", "keyup"];
const callbacks = [];

for (const i of validItems) {
  document.addEventListener(i, async function(e) {
    const find = callbacks.filter(j => j.event == i);

    for (const j of find) {
      if (j.uuid == focusedUUID) {
        j.callback(e);
        return;
      }
    }
  })
}

function returnEvt(uuid) {
  return function(name, callback) {
    if (validItems.includes(name)) {
      callbacks.push({
        event: name,
        uuid: uuid,
        callback: callback
      })
    }
  }
}