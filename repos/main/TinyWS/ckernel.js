// SecuKernel/genkernel but with a documentation wrapper for VSCode (and other intellisense IDEs)

const cKernel = {
  /**
   * Load and set extensions from the Kernel.
   */
  extensions: {
    /**
     * Loads extension into Kernel
     * @param {string} name Name of extension
     * @param {object} data Data to be returned when fetched
     * @param {*} isGenFunction When enabled, data becomes a function that can be dynamically generated
     */
    load: (name, data, isGenFunction) => Kernel.extensions.load(name, data, isGenFunction),
    /**
     * Gets kernel extension that was loaded into Kernel
     * @param {string} name Gets extension
     * @returns {object} Extension contents
     */
    get: (name) => Kernel.extensions.get(name)
  },

  process: {
    /**
     * Fetches process list with {id: id, name: "/bin/name"}
     * @returns {object[]} Process list
     */
    getTree: () => Kernel.process.getTree(),
    /**
     * Creates process function
     * @deprecated Call spawn() directly instead, with your data.
     * @param {string} funcStr String to convert into function
     * @returns {string} Self
     */
    create: (funcStr) => Kernel.process.create(funcStr),
    /**
     * Spawns process
     * @param {string} name Process name
     * @param {string} funcStr Function data
     * @param {*} argv Arguments to pass into function
     */
    spawn: async(name, funcStr, argv) => Kernel.process.spawn(name, funcStr, argv)
  },

  /**
   * Framebuffer related stuff
   */
  display: {
    /**
     * Gets framebuffer to use
     * @returns 2d canvas to use
     */
    getFramebuffer: () => Kernel.display.getFramebuffer()
  },

  accounts: {
    /**
     * Attempts to elevate to said user
     * @param {string} username Username of user 
     * @param {string} password Password of user
     * @returns {boolean} True if successful, false if unsuccessful
     */
    elevate: async(username, password) => Kernel.accounts.elevate(username, password),
    /**
     * Gets current info about the user
     * @returns {object} Returns: username, groups, permLevel, hashedPassword
     */
    getCurrentInfo: () => Kernel.accounts.getCurrentInfo()
  },

  proxies: {
    /**
     * Adds event listener, refer to https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * Deprecated if using as root, use document instead as we now expose that 
     */
    addEventListener: (...args) => Kernel.proxies.addEventListener(args)
  },

  verInfo: {
    /**
     * Version number of OS
     * @returns {number} Number identifier of build
     */
    ver: () => Kernel.verInfo.ver,
    /**
     * Display version of OS
     * @returns {string} String identifier of build, not exact
     */
    displayVer: () => Kernel.verInfo.displayVer,
    /**
     * Fetches if the OS is beta or not
     * @returns {boolean} Boolean to see if the OS is beta or not
     */
    isBeta: () => Kernel.verInfo.isBeta
  }
}