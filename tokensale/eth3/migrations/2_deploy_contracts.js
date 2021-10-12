const TrentToken = artifacts.require("./TrentToken.sol");
const TrentTokenSale = artifacts.require("./TrentTokenSale.sol");

module.exports = async (deployer) => {
  const [first, ...rest] = await web3.eth.getAccounts();

  const initialAmount = 1000000;
  await deployer.deploy(TrentToken, initialAmount);
  await deployer.deploy(TrentTokenSale, 1, first, TrentToken.address);

  let instance = await TrentToken.deployed();
  await instance.transfer(TrentTokenSale.address, initialAmount);
};
