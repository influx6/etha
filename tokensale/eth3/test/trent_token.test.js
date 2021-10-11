const TrentToken = artifacts.require("TrentToken");

var chai = require("chai");

const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

const chaiPromises = require("chai-as-promised");
chai.use(chaiPromises);


const expect = chai.expect;

contract("TrentTokenTest", async (accounts) => {
    const [deployerAccount, recipientAccount, thirdAccount] = accounts;

    it("should be able to get all tokens", async () => {
        let instance = await TrentToken.deployed();
        let totalSupply = await instance.totalSupply();
        let balance = await instance.balanceOf(deployerAccount);

        expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be able send token to another account", async () => {
        const sendTotalToken = 1;
        const instance = await TrentToken.deployed();

        let totalSupply = await instance.totalSupply();
        let balance = await instance.balanceOf(deployerAccount);
        expect(balance).to.be.a.bignumber.equal(totalSupply);

        expect(instance.transfer(recipientAccount, sendTotalToken)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTotalToken)));
        expect(instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(sendTotalToken));
    });

    // TODO(alex): Figure out why this test fails with some hidden after func
    it("should not be able to send more tokens than available", async () => {
        const sendNext = 20000000000;
        const instance2 = await TrentToken.deployed();

        const transferPromise = instance.transfer(recipientAccount, sendNext);
        expect(transferPromise).to.eventually.be.fulfilled;
        await transferPromise;
    });
})