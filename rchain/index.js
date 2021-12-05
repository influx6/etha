import express from "express";
import bodyParser from "body-parser";
import Blockchain from "./src/chain/blockchain.js";
import P2PServer from "./src/app/p2p.js";

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const genesisDate = new Date(2021, 10, 10, 0, 0, 0);
const bc = new Blockchain(genesisDate);
const p2pServer = new P2PServer(bc);

const app = express();
app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
	res.json(bc.chain);
})

app.get("/mine", (req, res) => {
	const block = bc.addBlock(req.body.data);
	console.log("Added block: ", block.toString());
	p2pServer.syncChain();
	res.redirect("/blocks");
})

p2pServer.listen()
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
