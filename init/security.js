// Implements virtual kernels.
console.log("Security: Preparing...");

Kernel.extensions.set("genkernel", function generateCustomKernel(username) {
  console.log("Security: Making kernel for '" + username + "'...");

  let newKernel = {
    extensions: {
      load: function(name, data) {},
      get: function (name) {}
    },
    process: {
      create(funcStr) {},
      async spawn(name, func, argv) {}
    }
  }

  newKernel.display = Kernel.display;

  return newKernel;
});