function outputDetails(event, uuid, x, y, w, h) {
  return wmConf.outputWrapper({
    event: event,
    uuid: uuid,
    details: {
      fetchWindowSize: () => {
        return {
          xy: [x, y],
          wh: [w, h]
        }
      }
    }
  });
}