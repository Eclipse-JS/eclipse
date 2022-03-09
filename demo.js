const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

let Applications = [];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

addEventListener("DOMContentLoaded", async function() {
    kernel.initExec(async function() {
        kernel.stdout("femInit v0.0.1\n");
        kernel.stdout("Fetching applications manifest...\n\n");

        let manifest = {};

        try {
            manifest = await axios.get("app/manifest.json");
        } catch (e) {
            kernel.stdout("Could not fetch applications manifest.\n");
            kernel.stdout(e);
        }

        for await (item of manifest.data) {
            kernel.stdout("Loading: ", item.name);
            
            try {
                let app = await axios.get("app/" + item.path);

                let func = new AsyncFunction("args", app.data);

                Applications.push({ name: item.name, function: func });

                kernel.stdout("   [OK]\n");
            } catch (e) {
                console.error(e);
                kernel.stdout("   [FAIL]\n");
            }
        }

        kernel.stdout("\n");
        kernel.stdout("Applications loaded.\n\n");

        let shellIndex = 0;

        for (let i = 0; i < Applications.length; i++) {
            if (Applications.name == "btm.sh") shellIndex = i;
        }

        try {
            await kernel.pexec(Applications[shellIndex].name, Applications[shellIndex].function);
        } catch (e) {
            kernel.stdout("Error running shell:", e, "\n");
        }
    })
});