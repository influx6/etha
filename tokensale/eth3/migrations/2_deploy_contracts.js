const TrentToken = artifacts.require("./TrentToken.sol");
const TrentTokenSale = artifacts.require("./TrentTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(TrentToken, 1000000);
  // deployer.deploy(TrentTokenSale, 1000000);
};
