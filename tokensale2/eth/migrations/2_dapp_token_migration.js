require("dotenv").config({path: "../.env"});

const DappToken = artifacts.require("DappToken.sol");

module.exports = async () => {
    await deployer.deploy(DappToken, process.env.INITIAL_TOKENS);
}