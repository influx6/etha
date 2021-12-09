import Transaction from "./transaction.js";

export default class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    getTransactions = () => {
        return this.transactions;
    }

    findTransactionForPublicKey = (publicKey) => {
        return this.transactions.find(t => t.input.address == publicKey);
    }

    findTransactionForWallet = (senderWallet) => {
        return this.findTransactionForPublicKey(senderWallet.publicKey);
    }

    clearPool = () => {
        this.transactions = [];
    }

    validTransactions = () => {
        return this.transactions.filter(t => {
            const outputTotal = t.outputs.reduce((total, output) => total + output.amount, 0);
            if (t.input.amount !== outputTotal) return false;
            if (TransactionPool.verifyTransaction(t)) return false;
            return true;
        });
    }

    updateOrAddTransaction = (transaction) => {
        let transactionIndex = this.transantions.findIndex(t => t.id === transaction.id);
        if (transactionIndex > -1) {
            this.transactions[transactionIndex] = transaction;
            return;
        }

        this.transactions.push(transaction);
    }
}