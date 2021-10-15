require("dotenv").config({path: "../.env"});

const chai = require("./setupchai");
const {Tokenizer} = require("truffle/build/573.bundled");

const TrentTokenSale = artifacts.require("TrentTokenSale.sol");
const TrentToken = artifacts.require("TrentToken.sol");
const KycContract = artifacts.require("KycContract.sol");

TrentToken.defaults({gasPrice: 0});
KycContract.defaults({gasPrice: 0});
TrentTokenSale.defaults({gasPrice: 0});

const BN = web3.utils.BN;
const expect = chai.expect;

contract("TrentTokenSaleTest", async (accounts) => {
    const [deployerAccount, recipientAccount, thirdAccount] = accounts;

    const createSupply = process.env.INITIAL_TOKENS;

    it("should be able to get all tokens", async () => {
        let instance = await TrentToken.deployed();
        let balance = await instance.balanceOf(deployerAccount);
        expect(balance).to.be.a.bignumber.equal(new BN(0));
    });

    it("should have all tokens in SmartContract for TokenSale", async () => {
        let instance = await TrentToken.deployed();
        let balance = await instance.balanceOf(TrentTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be able to buy tokens", async () => {
        let instance = await TrentToken.deployed();
        let kycInstance = await KycContract.deployed();
        let saleInstance = await TrentTokenSale.deployed();

        let balanceBefore = await instance.balanceOf(deployerAccount);

        // accept deployer into kyc
        await kycInstance.setKycCompleted(deployerAccount, {
            from: deployerAccount,
        });

        await saleInstance.sendTransaction({
            from: deployerAccount,
            value: web3.utils.toWei("1", "wei"),
        });

        const currentBalance = await instance.balanceOf(deployerAccount);
        return expect(currentBalance).to.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    });
})
