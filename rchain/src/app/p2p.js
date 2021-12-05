import WebSocket, { WebSocketServer } from "ws";

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export default class P2PServer {
	constructor(blockchain) {
		this.blockchain = blockchain;
		this.sockets = [];
		this.address = null;
	}

	listen = () => {
		this.server = new WebSocketServer({
			port: P2P_PORT,
		});
		this.server.on("connection", (socket, req) => {
			this.address = req.socket.remoteAddress || socket.url;
			console.log(`Connection live: ${P2P_PORT} -> ${this.address}`);
			this.onSocket(socket);
		});
		this.connectToPeers();
		console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
	};

	connectToPeers = () => {
		peers.forEach(peer => {
			const socket = new WebSocket(peer);
			socket.on('open', () => this.onSocket(socket))
		});
	};

	onSocket = (socket) => {
		console.log("New Socket connected: ", socket.url);
		socket.on("message", (messageBytes) => {
			const message = JSON.parse(messageBytes);
			this.updateChain(socket, message);
		});

		this.sendChain(socket);
		this.sockets.push(socket);
	};

	messageHandler = (socket) => {
	};

	updateChain = (socket, message) => {
		const { chain, peer, from } = message;
		console.log(`synchronizing chains from peer: ${peer} from node ${from} with chain: ${JSON.stringify(chain, null, 2)}`);
		this.blockchain.replaceChain(chain);
		console.log(`updated chain from peer: ${peer} from node ${from}`);
	};

	sendChain = (socket) => {
		socket.send(JSON.stringify({
			from: socket.url,
			peer: this.address,
			chain: this.blockchain.chain,
		}));
	};

	syncChain = () => {
		this.sockets.forEach(socket => this.sendChain(socket));
	};
}
