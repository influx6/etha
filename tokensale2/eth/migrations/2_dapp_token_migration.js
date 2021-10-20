require("dotenv").config({path: "../.env"});

const DappToken = artifacts.require("./DappToken.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

const InitialAmount = parseInt(process.env.INITIAL_TOKENS);
const TokenPrice = parseInt(process.env.TOKEN_PRICE);

module.exports = async (deployer) => {
    const [first, second, ...rest] = await web3.eth.getAccounts();

    await deployer.deploy(DappToken, InitialAmount);
    await deployer.deploy(TokenSale, DappToken.address, TokenPrice);

    const instance = await DappToken.deployed();
    await instance.transfer(TokenSale.address, InitialAmount, { from: first });
}