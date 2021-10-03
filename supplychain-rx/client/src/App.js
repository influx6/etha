import React, {Component} from "react";
import SupplyChainContract from "./contracts/SupplyChain.json";
import PayContract from "./contracts/PayContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    state = {
        storageValue: 0,
        web3: null,
        accounts: null,
        networkId: null,
        supplyChainContract: null,
        supplyChainContractCreator: null,
        payContract: null,
        payContractCreator: null,
        data: {cost: 0.0, identifier: null},
    };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            // 1. get current network id which tells us which network is currently used.
            const networkId = await web3.eth.net.getId();



            const createPayContractCreator = () => {
                // 2. current smart contract address for current networkId.
                const payContractDeployedNetwork = PayContract.networks[networkId];
                console.log("Creating user with networkId: ", networkId, payContractDeployedNetwork);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    PayContract.abi,
                    payContractDeployedNetwork && payContractDeployedNetwork.address,
                );
            }

            const createSupplyChainInstance = () => {
                // 2. current smart contract address for current networkId.
                const supplyChainDeployedNetwork = SupplyChainContract.networks[networkId];
                console.log("Creating user with networkId: ", networkId, supplyChainDeployedNetwork);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    SupplyChainContract.abi,
                    supplyChainDeployedNetwork && supplyChainDeployedNetwork.address,
                );
            }

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                web3,
                accounts,
                networkId,
                supplyChainContract: createSupplyChainInstance(),
                supplyChainContractCreator: createSupplyChainInstance,
                payContractCreator: createPayContractCreator,
            }, this.listenToPaymentEvent);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    handleSubmit = async () => {
        const {data, supplyChainContract, accounts} = this.state;
        const {cost, identifier} = data;
        console.log(`Will create payable item in contract with cost: ${cost} and ${identifier}`)
        const result = await supplyChainContract.methods.createItem(identifier, cost).send({from: accounts[0]});
        console.log("Result of contract operation: ", result);
    }

    listenToPaymentEvent = () => {
        const { supplyChainContract } = this.state;
        supplyChainContract.events.SupplyChainStep().on("data", async (event) => {
           console.log("Received new event: ", event);
        });
    }

    render() {
        const {web3, data} = this.state;
        if (!web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }

        return (
            <div className="App">
                <h1>SupplyChain Example!</h1>

                <h2>Items</h2>

                <div>
                    <h2>Add Items</h2>
                    <p>
                        <label>Const in Wei: </label>
                        <input type="text" name="cost" value={data.cost} onChange={(event) => {
                            const name = event.target.name;
                            const value = event.target.value;
                            const newData = {...data};
                            newData[name] = value;
                            this.setState({data: newData});
                        }}/>
                    </p>
                    <p>
                        <label>Identifier: </label>
                        <input type="text" name="identifier" value={data.identifier || ""} onChange={(event) => {
                            const name = event.target.name;
                            const value = event.target.value;
                            const newData = {...data};
                            newData[name] = value;
                            this.setState({data: newData});
                        }}/>
                    </p>
                    <p>
                        <button type="button" onClick={this.handleSubmit}>Create New Payable</button>
                    </p>
                </div>

            </div>
        );
    }
}

export default App;
