// Implements virtual kernels.
console.log("Security: Preparing...");

Kernel.extensions.set("genkernel", function generateCustomKernel(username) {
  console.log("Security: Making kernel for '" + username + "'...");

  let newKernel = {
    extensions: {
      load(name, data) {},
      get(name) {}
    },
    process: {
      create(funcStr) {},
      async spawn(name, func, argv) {}
    },
    async createUser(username, password) {}
  }

  newKernel.display = Kernel.display;

  return newKernel;
});