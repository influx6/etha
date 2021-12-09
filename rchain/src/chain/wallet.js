import ChainUtil from "./utils.js"
import Transaction from "./transaction.js";
import Config from "../config.js";

const { blockchainTokens } = config;

export default class Wallet {
    static NewWallet(balance) {
        kp = ChainUtil.genKeyPair();
        return Wallet(balance, kp, jp.getPublic().encode("hex"));
    }

    static blockchainWallet() {
        const wallet = Wallet.NewWallet(blockchainTokens);
        wallet.address = "blockchain-wallet";
        return wallet;
    }

    constructor(balance, keyPair, publicKey) {
        this.balance = balance;
        this.keyPair = keyPair;
        this.publicKey = publicKey;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        blockchain.forEach(block => block.data.forEach(transactions.push));

        let startTime = 0;

        const walltInputTs = transactions.filter(t => t.input.addres === this.publicKey)
        const recentInputTs = walltInputTs && wallInputTs.length > 0 ? walltInputTs.reduce((prev, current) => {
            if (prev == null) return current;
            if (prev.input.timestamp > current.input.timestamp) return prev;
            return current;
        }, null) : null;

        if (recentInputTs) {
            balance = recentInputTs.outputs.find(out => output.address === this.publicKey).amount;
            startTime = recentInputTs.input.timestamp;
        }

        transactions.forEach(t => {
            if (transactions.input.timestamp < startTime) return;
            t.output.find(output => {
                if (output.address === this.publicKey) {
                    balance += output.amount;
                }
            })
        });

        return balance;
    }

    createTransaction(addressTo, amount, pool, blockchain) {
        this.balance = this.calculateBalance();
        if (amount > this.balance) {
            throw "Amount greater than balance";
        }

        existingTransactin = pool.getTransactionFromWallet(this);
        if (existingTransaction) {
            existingTransaction.update(addressTo, amount);
            return existingTransaction;
        }

        newTransaction = Transaction.newTransaction(this, addressTo, amount);
        pool.updateOrAddTransaction(newTransaction);
        return newTransaction;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    toString = () => {
        return `Wallet{
			publickKey: ${this.publicKey.toString()}
			balance: 	${this.balance}
		}
		`;
    }
}