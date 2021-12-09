import express from "express";
import bodyParser from "body-parser";
import Blockchain from "./src/chain/blockchain.js";
import Wallet from "./src/chain/wallet.js";
import Miner from "./src/chain/miner.js";
import TransactionPool from "./src/chain/transaction_pool.js";
import P2PServer from "./src/app/p2p.js";
import config from "./src/config";

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const genesisDate = new Date(2021, 10, 10, 0, 0, 0);
const bc = new Blockchain(genesisDate);

const wallet = Wallet.newWallet(config.initialBalance);
const blockchainWallet = Wallet.blockchainWallet();
const pool = TransactionPool();
const p2pServer = new P2PServer(bc, pool);
const miner = Miner(pool, bc, wallet, blockchainWallet, p2pServer);

const app = express();
app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
    res.json(bc.chain);
});

app.get("/mine-transactions", (req, res) => {
    block = miner.mine();
    console.log("Mined block: ", block);
    res.redirect("/blocks");
});

app.get("/get-public-key", (req, res) => {
    res.json({
        publickey: wallet.publicKey
    });
});

app.get("/transactions", (req, res) => {
    res.json(pool.getTransactions());
});

app.get("/transact", (req, res) => {
    const { addressTo, amount } = req.body;
    const transaction = wallet.createTransaction(addressTo, amount, pool, bc);
    p2pServer.broadcastTransactions(transaction);
    res.redirect("/transactions");
});

app.get("/mine", (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log("Added block: ", block.toString());
    p2pServer.syncChain();
    res.redirect("/blocks");
})

p2pServer.listen();
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));