const validItems = ["keypress"];
const callbacks = [];

for (const i of validItems) {
  document.addEventListener(i, async function(e) {
    const find = callbacks.filter(j => j.event == i);

    for (const j of find) {
      if (j.uuid == focusedUUID) {
        await j.callback();
      }
    }
  })
}

function returnEvt(uuid) {
  return new function(name, callback) {
    if (validItems.includes(name)) {
      callbacks.push({
        event: name,
        uuid: uuid,
        callback: uuid
      })
    }
  }
}