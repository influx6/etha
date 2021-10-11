const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "../client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "localhost",
      network_id: 5777,
    },
    develop: {
      port: 8545
    },
  },
  compilers: {
    solc: {
      version: "0.6.1",
    }
  }
};
