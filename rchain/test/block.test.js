import Block from "../src/chain/block.js";
import config from "../src/config.js";
import expect from "expect";

config.difficulty = 2;

describe("Block spec", () => {
	let genesis;
	beforeEach(() => {
		const timestamp = new Date();
		genesis = Block.genesis(timestamp);
	});

	it("should be able to create genesis block", () => {
		console.log("Block: ", genesis.toString());
		expect(genesis).toNotBeNull;
	})

	it("should be able to mine a block", () => {
		const block = Block.mineBlock(genesis, { "name": "foo" });
		console.log("Block: ", block.toString());
		expect(block).toNotBeNull;
		expect(block.data.name).toBe("foo");
	})
})
