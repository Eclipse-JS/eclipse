function createElementSec(elem) {
  if (elem == "script") return panic("Attempted privelege escelation!", "Kernel::display::getFramebuffer::v2");

  const createdElement = createElementInject(elem);
  createdElement.createElement = createElementSec;

  return createdElement;
}

export { createElementSec };