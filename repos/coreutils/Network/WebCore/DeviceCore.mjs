qb.enableRegularRequire();
require("./Devices/Loopback.mjs");

const networkDevices = [];

const netAPI = {
  /**
   * Connect to an IP address.
   * @param {string} ip IP address to connect to
   * @param {number} port Port to connect to
   */
  async connect(ip, port) {
    // Check to see if the IP address contains 4 octets.
    if (ip.split(".").length != 4) {
      throw new Error("Not a valid IP address!");
    }

    // Check to see if the port is a number.
    if (isNaN(port)) {
      throw new Error("Port is not a number.");
    }
  
    const ipSplit = ip.split(".");

    const deviceID = parseInt(ipSplit[0]);
    const firstSubnetID = parseInt(ipSplit[1]);
    const secondSubnetID = parseInt(ipSplit[2]);
    const hostID = parseInt(ipSplit[3]);

    if (isNaN(deviceID) || isNaN(firstSubnetID) || isNaN(secondSubnetID) || isNaN(hostID)) {
      throw new Error("IP address does not fully contain numbers!");
    }

    const deviceHostingIP = networkDevices.find((i) => {
      // TODO:  && i.hostIDs.includes(hostID)

      const nid = i.networkID;
      if (nid.deviceID == deviceID && nid.firstSubnetID == firstSubnetID && nid.secondSubnetID == secondSubnetID) {
        return true;
      }
    });

    if (!deviceHostingIP) {
      throw new Error("Could not find any network devices that are hosting that IP!");
    }

    return deviceHostingIP.eventDispatchers.whenConnected(hostID, port);
  },

  /**
   * Listens on a port.
   * @param {string} ip IP to listen on (can be 0.0.0.0 to attempt to listen on all IPs)
   * @param {number} port Port to listen on (can be from 0 to 65535)
   */
  async listen(ip, port) {
    // Check to see if the IP address contains 4 octets.
    if (ip.split(".").length != 4) {
      throw new Error("Not a valid IP address!");
    }

    // Check to see if the port is a number.
    if (isNaN(port)) {
      throw new Error("Port is not a number.");
    }

    // Parse the IP address by splitting it, and parsing each element as a number.
    const ipSplit = ip.split(".");

    const deviceID = parseInt(ipSplit[0]);
    const firstSubnetID = parseInt(ipSplit[1]);
    const secondSubnetID = parseInt(ipSplit[2]);
    const hostID = parseInt(ipSplit[3]);

    if (isNaN(deviceID) || isNaN(firstSubnetID) || isNaN(secondSubnetID) || isNaN(hostID)) {
      throw new Error("IP address does not fully contain numbers!");
    }

    const deviceHostingIP = networkDevices.find((i) => {
      // TODO: && i.hostIDs.includes(hostID)
      const nid = i.networkID;
      if (nid.deviceID == deviceID && nid.firstSubnetID == firstSubnetID && nid.secondSubnetID == secondSubnetID) {
        return true;
      }
    });

    if (!deviceHostingIP) {
      throw new Error("Could not find any network devices that are hosting that IP!");
    }

    return deviceHostingIP.eventDispatchers.whenListened(hostID, port);
  },

  /**
   * Core network device stuff.
   */
  core: {
    /**
     * Adds a network device to the system.
     * @param {string} name Network device name (ex. relay0, lo)
     * @param {number} deviceID Device ID of the subnet (ex. 68 is Comcast from standard IPv4)
     * @param {number} firstSubnetID First subnet ID
     * @param {number} secondSubnetID Second subnet ID
     * @param {number[]} hostIDs All host IDs that you have for the object
     * @param {function} whenConnected Event called when you recieve a connection request from your IP
     * @param {function} whenListened Event called when you recieve a listen request from your IP
     * @returns {object} Network device object
     */
    addNetworkDevice(name, deviceID, firstSubnetID, secondSubnetID, hostIDs, whenConnected, whenListened) {
      const checkIfHostIDsAreNotAnInteger = (elem) => isNaN(elem);
      const checkIfHostIDsAreCompliantSize = (elem) => elem > 255 || elem <= 0;

      // Validate that everything is the correct type, which is an number, currently
      if (
        isNaN(deviceID) ||
        isNaN(firstSubnetID) ||
        isNaN(secondSubnetID) ||
        hostIDs.some(checkIfHostIDsAreNotAnInteger)
      ) {
        throw new Error("Any part of the virtual IP address(es) are not a number!");
      }

      // Validate that everything is not above 255, the limit
      // Since I'm trying to base this off of IPv4.
      if (
        deviceID > 255 ||
        firstSubnetID > 255 ||
        secondSubnetID > 255 ||
        hostIDs.some(checkIfHostIDsAreCompliantSize)
      ) {
        throw new Error(hostIDs.length != 1 ? "The IP addresses are too big!" : "The IP address is too big!");
      }

      // Validate that the whenConnected() and whenListened() functions are indeed functions
      if (typeof whenConnected != "function" || typeof whenListened != "function") {
        throw new Error("Either whenConnected() or whenListened() are not functions!");
      }

      // Network device generated.
      const netDevice = {
        name,
        eventDispatchers: {
          whenConnected,
          whenListened
        },
        networkID: {
          deviceID,
          firstSubnetID,
          secondSubnetID
        },
        hostIDs
      };

      networkDevices.push(netDevice);
      return netDevice;
    },

    /**
     * Gets all the network devices on the system.
     * @returns {object} List of all network devices on the system
     */
    getNetworkDevices() {
      return networkDevices.map((item) => {
        return {
          name: item.name,
          networkID: item.networkID,
          hostIDs: item.hostIDs
        }
      })
    },
  },

  /**
   * Internal functions designed to be used for network devices
   */
  helperInternal: {
    sanitizeIPMsg: function(data) {
      const layerOneSanitize = typeof data == "object" ? JSON.stringify(data) : data;
      const layerTwoSanitize = `${layerOneSanitize}`; // Ensure that data is a string

      return layerTwoSanitize;
    }
  }
};

loadLoopback(netAPI);