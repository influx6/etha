import sha256 from "crypto-js/sha256.js"
import config from "../config.js";


export default class Block {
	constructor(timestamp, lastHash, hash, data, nounce) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.nounce = nounce;
		this.data = data;
	}

	toString() {
		return JSON.stringify(this, null, 2);
	}

	static genesis(timestamp) {
		const hash = Block.hash(timestamp, 0, {});
		return new this(timestamp, 0, hash, [], 0);
	}

	static mineBlock(lastBlock, data) {
		const lastHash = lastBlock.hash;

		let timestamp;
		let hash;
		let nounce = 0;
		do {
			nounce++;
			timestamp = Date.now();
			hash = Block.hash(timestamp, lastHash, data, nounce);
		} while (hash.substring(0, config.difficulty) !== '0'.repeat(config.difficulty));

		return new Block(timestamp, lastHash, hash, data, nounce);
	}

	static hash(timestamp, lastHash, data, nounce) {
		return sha256(`${timestamp}${lastHash}${data}${nounce}`).toString();
	}

	static blockHash(block) {
		const { timestamp, lastHash, data, nounce } = block;
		return Block.hash(timestamp, lastHash, data, nounce);
	}
}
