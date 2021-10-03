const SupplyChainContract = artifacts.require("./SupplyChain.sol");

contract("SupplyChain", accounts => {
  it("...should create item.", async () => {
    const supplyChain = await SupplyChainContract.deployed();

    const result = await supplyChain.createItem("lava", 100, { from: accounts[0] });

    assert.equal(result.logs[0].args.index, 0, "It must be zero");

    const item = await supplyChain.items(0);
    assert.equal(item.identifier, "lava", "It must be equal to 'lava'")
    assert.equal(item.itemPrice, 100, "It must be equal to '100'")
  });
});
