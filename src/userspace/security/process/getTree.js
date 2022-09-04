const tree = Kernel.process.getTree();
        let newTree = tree.map(i => {
          const filter = processTreeExtras.filter(j => j.id == i.id);

          if (filter.length == 0) {
            let newData = i;

            newData.userInfo = {
              "groups": [
                "root"
              ],
              "permLevel": "0",
              "hashedPassword": "2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9",
              "username": "root"
            }; // Dummy root user info

            return newData;
          }

          return filter[0];
        });

        return newTree;