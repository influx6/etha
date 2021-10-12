const {env} = require("truffle/build/987.bundled");
const TrentToken = artifacts.require("./TrentToken.sol");
const TrentTokenSale = artifacts.require("./TrentTokenSale.sol");

require("dotenv").config({path: "../.env"});

const InitialTokenAmount = parseInt(process.env.INITIAL_TOKENS)

module.exports = async (deployer) => {
    const [first, ...rest] = await web3.eth.getAccounts();

    await deployer.deploy(TrentToken, InitialTokenAmount);
    await deployer.deploy(TrentTokenSale, 1, first, TrentToken.address);

    let instance = await TrentToken.deployed();
    await instance.transfer(TrentTokenSale.address, InitialTokenAmount);
};
