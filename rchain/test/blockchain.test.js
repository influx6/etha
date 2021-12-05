import Blockchain from "../src/chain/blockchain.js";
import config from "../src/config.js";
import expect from "expect";

config.difficulty = 2;

describe("Block spec", () => {
	let blockchain, blockchain2;
	beforeEach(() => {
		const timestamp = new Date();
		blockchain = new Blockchain(timestamp);
		blockchain2 = new Blockchain(timestamp);
	});

	it("should have a genesis block in the blockchain", () => {
		expect(blockchain.genesisBlock()).toNotBeNull;
		expect(blockchain.chain.length).toBe(1);
	});

	it("should be able to create a new block", () => {
		const data = "foo";
		const newBlock = blockchain.addBlock(data);

		expect(blockchain.chain.length).toBe(2);
		expect(newBlock.data).toBe(data);
		expect(newBlock.lastHash).toBe(blockchain.genesisBlock().hash);
	});

	it("should be able to validate a new block", () => {
		const data = "foo";
		blockchain2.addBlock(data);

		console.log("Blockchain: ", blockchain.toString());
		console.log("Blockchain2: ", blockchain2.toString());

		expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
	});

	it("should be able to invalidate a corrupted block", () => {
		blockchain2.chain[0].data = "corrupted";
		console.log("Blockchain2: ", blockchain2.toString());

		expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
	});

	it("should be able to invalidate a corrupted new block", () => {
		const newBlock = blockchain2.addBlock("ba");
		newBlock.data = "corrupted";

		expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
	});

	it("should be able to replace a chain with longer chain", () => {
		blockchain2.addBlock("ba");
		blockchain2.addBlock("ba2");
		blockchain2.addBlock("ba3");

		expect(blockchain.toString()).not.toBe(blockchain2.toString());
		blockchain.replaceChain(blockchain2.chain);
		expect(blockchain.toString()).toBe(blockchain2.toString());
	});

	it("should not be able to replace a chain with equal chain length", () => {
		blockchain2.addBlock("ba");
		blockchain2.addBlock("ba2");

		blockchain.addBlock("ba3");
		blockchain.addBlock("ba4");

		expect(blockchain.toString()).not.toBe(blockchain2.toString());
		blockchain.replaceChain(blockchain2.chain);
		expect(blockchain.toString()).not.toBe(blockchain2.toString());
	});
})
