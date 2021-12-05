import sha256 from "crypto-js/sha256.js"

export default class Block {
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	toString() {
		return JSON.stringify(this, null, 2);
	}

	static genesis(timestamp) {
		const hash = Block.hash(timestamp, 0, {});
		return new this(timestamp, 0, hash, []);
	}

	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const lastHash = lastBlock.hash;
		const hash = Block.hash(timestamp, lastHash, data);
		return new Block(timestamp, lastHash, hash, data);
	}

	static hash(timestamp, lastHash, data) {
		return sha256(`${timestamp}${lastHash}${data}`).toString();
	}

	static blockHash(block) {
		const { timestamp, lastHash, data } = block;
		return Block.hash(timestamp, lastHash, data);
	}
}
