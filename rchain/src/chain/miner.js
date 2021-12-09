import Transaction from "./transaction.js";
import Config from "../config.js";

const { minerReward } = Config;

export default class Miner {
    constructor(pool, blockchain, wallet, blockchainWallet, p2pServer) {
        this.pool = pool;
        this.blockchainWallet = blockchainWallet;
        this.wallet = wallet;
        this.blockchain = blockchain;
        this.p2pServer = p2pServer;
        this.blockchainWallet = blockchainWallet;
    }

    mine = () => {
        const pendingTransactions = this.pool.getTransactions();
        const validTransactions = this.pool.validTransactions();
        validTransactions.push(Transaction.rewardTransactions(this.blockchainWallet, minerReward));
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        this.pool.clearPool();
        this.p2pServer.broadcastClearPool(pendingTransactions);
        return block;
    }
}