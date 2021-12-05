import sha256 from "crypto-js/sha256.js"
import config from "../config.js";

export default class Block {
	constructor(timestamp, lastHash, hash, data, nounce, difficulty) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.difficulty = difficulty;
		this.nounce = nounce;
		this.data = data;
	}

	toString() {
		return JSON.stringify(this, null, 2);
	}

	static genesis(timestamp) {
		const hash = Block.hash(timestamp, 0, {});
		return new this(timestamp, 0, hash, [], 0, config.difficulty);
	}

	static mineBlock(lastBlock, data) {
		const lastHash = lastBlock.hash;
		let difficulty = config.difficulty;

		let timestamp;
		let hash;
		let nounce = 0;
		do {
			nounce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficulty(lastBlock, timestamp);
			hash = Block.hash(timestamp, lastHash, data, nounce, difficulty);
		} while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new Block(timestamp, lastHash, hash, data, nounce, difficulty);
	}

	static hash(timestamp, lastHash, data, nounce, difficulty) {
		return sha256(`${timestamp}${lastHash}${data}${nounce}${difficulty}`).toString();
	}

	static blockHash(block) {
		const { timestamp, lastHash, data, nounce, difficulty } = block;
		return Block.hash(timestamp, lastHash, data, nounce, difficulty);
	}

	static adjustDifficulty(lastBlock, timestamp) {
		const currentRate = lastBlock.timestamp + config.mineRate;
		if (currentRate > timestamp) {
			return lastBlock.difficulty + 1;
		}
		return lastBlock.difficulty - 1;
	}
}
