if (args[0] !== undefined) {
    let argv = args.join(" ");

    try {
        resp = await eval(argv);
    } catch (e) {
        resp = e;
    }

    kernel.stdout(resp);
} else {
    kernel.stdout("execJS v0.1.0\n\n");

    while (true) {
        kernel.stdout("> ");
        let stdin = await kernel.stdin();

        if (stdin.startsWith(".exit")) {
            return;
        }

        let resp = "";

        try {
            resp = await eval(`JSON.stringify(${stdin})`);
        } catch (e) {
            resp = e;
        }
        kernel.stdout(resp, "\n");
    }
}