const VFS = Kernel.extensions.get("Vfs");

if (!VFS.read("/etc/init.d/init.conf").split("\n").includes("/bin/fakedom")) {
  if (Kernel.accounts.getCurrentInfo().permLevel != 0) return;
  const init = VFS.read("/etc/init.d/init.conf");
  VFS.write("/etc/init.d/init.conf", "/bin/fakedom\n" + init);

  if (argv.length != 0) {
    argv[0].stdout("Installed FakeDOM.\n");
    return;
  }
}

Kernel.extensions.load("LibFakeDOM", function(evtListen, evtRemoveListen, enableSecurity) {
  const vdom = new Document();
  const eventListener = evtListen ? evtListen : Kernel.proxies.addEventListener;
  const removeEventListener = evtRemoveListen ? evtRemoveListen : Kernel.proxies.removeEventListener;

  const noSecurityForLulz = Kernel.accounts.getCurrentInfo().permLevel == 0 && enableSecurity ? true : false;

  if (!noSecurityForLulz) {
    vdom.addEventListener = eventListener;
    vdom.removeEventListener = removeEventListener;

    vdom.createElement = function (item) {
      if (item != "script") return document.createElement(item);
    }
  }

  const vwin = new Object();

  Object.defineProperty(vwin, "navigator", {
    get: function() {
      return {
        userAgent: window.navigator.userAgent + " MappingLayer/1.0",
        vendor: window.navigator.vendor,
        language: window.navigator.language,
        hardwareConcurrency: window.navigator.hardwareConcurrency,
        deviceMemory: window.navigator.deviceMemory,
        platform: window.navigator.platform,
        product: window.navigator.product
      }
    }
  });

  Object.defineProperty(vwin, "location", {
    get: () => vdom.location
  });

  // TODO: Make this less stupid.

  Object.defineProperty(vwin, "screen", {
    get: () => window.screen
  });

  Object.defineProperty(vwin, "devicePixelRatio", {
    get: () => window.devicePixelRatio
  });

  Object.defineProperty(vwin, "document", {
    get: () => vdom
  });

  Object.defineProperty(vwin, "innerWidth", {
    writable: true
  });

  Object.defineProperty(vwin, "innerHeight", {
    writable: true
  });

  Object.defineProperty(vwin, "outerWidth", {
    writable: true
  });

  Object.defineProperty(vwin, "outerHeight", {
    writable: true
  });

  Object.defineProperty(vwin, "addEventListener", {
    get: () => addEventListener
  });

  Object.defineProperty(vwin, "removeEventListener", {
    get: () => removeEventListener
  });

  vwin.innerWidth  = 1280;
  vwin.innerHeight = 720;

  vwin.outerWidth  = 1280;
  vwin.outerHeight = 720;

  return { document: vdom, window: vwin};
})