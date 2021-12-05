import Block from './block.js';

export default class Blockchain {
	constructor(timestamp) {
		this._genesisBlock = Block.genesis(timestamp);
		this.chain = [this._genesisBlock];
	}

	genesisBlock() {
		return this._genesisBlock;
	}

	addBlock(data) {
		const lastBlock = this.chain[this.chain.length - 1];
		const block = Block.mineBlock(lastBlock, data);
		this.chain.push(block);
		return block;
	}

	replaceChain(chain) {
		if (chain.length <= this.chain.length) return;
		if (!this.isValidChain(chain)) return;
		this.chain = chain;
	}

	isValidChain(chain) {
		if (JSON.stringify(this.genesisBlock()) !== JSON.stringify(chain[0])) {
			return false;
		}

		for (var i = 1; i < chain.length; i++) {
			const chainBlock = chain[i];
			const chainLastBlock = chain[i - 1];
			if (chainBlock.lastHash !== chainLastBlock.hash) return false;
			if (chainBlock.hash !== Block.blockHash(chainBlock)) return false;
		}

		return true;
	}

	toString() {
		return JSON.stringify(this, null, 2);
	}
}
