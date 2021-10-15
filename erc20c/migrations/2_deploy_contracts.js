const ECToken = artifacts.require("./ECToken.sol");

require("dotenv").config({path: "../.env"});

const InitialTokenAmount = parseInt(process.env.INITIAL_TOKENS)

module.exports = async (deployer) => {
    // const [first, ...rest] = await web3.eth.getAccounts();
    await deployer.deploy(ECToken, InitialTokenAmount);
};
