require("dotenv").config({path: ".env"});

const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Mnemonic = process.env.MNEMONIC
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "../dapp/src/contracts"),
  networks: {
    local: {
      network_id: "*",
      provider: () => {
        return new HDWalletProvider(Mnemonic, "http://127.0.0.1:7545", AccountIndex);
      },
    },
    ganache: {
      port: 7545,
      host: "localhost",
      network_id: "*",
      gas: 3500000,
    },
    developer: {
      port: 7545,
      host: "localhost",
      network_id: "*" // Match any network id
    },
    development: {
      port: 7545,
      host: "localhost",
      network_id: "*" // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.6.1",
    },
  }
};
