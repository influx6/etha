require("dotenv").config({path: "../.env"});


const chai = require("./setupchai");
const BN = web3.utils.BN;
const expect = chai.expect;

const DappToken = artifacts.require("DappToken.sol");

contract("DappToken Specs", async (accounts) => {
    let dappTokenInstance = null;

    beforeEach(async () => {
        dappTokenInstance = await DappToken.deployed();
    });

    it("should be able to get deployed DappTokken", async () => {
        expect(dappTokenInstance).to.not.be.null();
    });
});
