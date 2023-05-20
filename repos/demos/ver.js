const input = await Kernel.extensions.get("input");

input.stdout(`EclipseOS v${Kernel.verInfo.ver}\n`);
input.stdout(`Codename: ${Kernel.verInfo.displayVer}\n`);
input.stdout(`is beta/internal: ${Kernel.verInfo.isBeta ? "yes" : "no"}\n`);
