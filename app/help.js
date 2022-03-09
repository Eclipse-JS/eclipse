kernel.stdout("List of commands:");

for (app of Applications) {
    kernel.stdout(" ", app.name, " ");
}