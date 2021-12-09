import ChainUtil from "./utils.js";
import Config from "../config.js";

const { minerReward } = Config;

export default class Transaction {
    constructor(id) {
        this.id = ChainUtil.id();
        this.input = { address: null };
        this.outputs = [];
    }

    update = (senderWallet, addressTo, amount) => {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amount > senderOutput.amount) {
            throw "Amount exceeds current transactions balance";
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: addressTo });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static transactionWithOutputs(senderWallet, output) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(trx, senderWallet);
        return transaction;
    }

    static rewardTransaction(blockchainWallet, addressTo, amount) {
        if (amount > blockchainWallet.balance) {
            throw "Amount exceeds wallet balance";
        }

        return Transaction.transactionWithOutputs(blockchainWallet, [
            { amount: amount, address: addressTo, },
        ]);
    }

    static newTransaction(senderWallet, addressTo, amount) {
        if (amount > senderWallet.balance) {
            throw "Amount exceeds wallet balance";
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey, },
            { amount: amount, address: addressTo, },
        ]);
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(transaction.signature, transaction.address, ChainUtil.hashData(transaction.outputs));
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hashData(transaction.outputs)),
        };
    }
}