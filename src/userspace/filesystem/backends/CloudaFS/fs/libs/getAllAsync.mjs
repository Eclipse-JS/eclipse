function getAllPromise(objStore) {
  const getAllReq = objStore.getAll();

  return new Promise((resolve, reject) => {
    getAllReq.addEventListener("success", (e) => {
      resolve(e);
    });

    getAllReq.addEventListener("error", (e) => {
      reject(e);
    })
  });
}