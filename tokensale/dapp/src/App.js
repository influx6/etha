import React, {Component} from "react";
import TrentToken from "./contracts/TrentToken.json";
import KycContract from "./contracts/KycContract.json";
import TrentTokenSale from "./contracts/TrentTokenSale.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    state = {
        storageValue: 0,
        web3: null,
        accounts: null,
        networkId: null,
        kycInstance: null,
        tokenInstance: null,
        tokenSaleInstance: null,
        data: { kycAddress: null, },
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

            const createKycContractCreator = () => {
                // 2. current smart contract address for current networkId.
                const network = KycContract.networks[networkId];
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    KycContract.abi,
                    network && network.address,
                );
            }

            const createTrentTokenSaleInstance = () => {
                // 2. current smart contract address for current networkId.
                const network = TrentTokenSale.networks[networkId];
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    TrentTokenSale.abi,
                    network && network.address,
                );
            }

            const createTrentTokenInstance = () => {
                // 2. current smart contract address for current networkId.
                const network = TrentToken.networks[networkId];
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    TrentToken.abi,
                    network && network.address,
                );
            }

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                web3,
                accounts,
                networkId,
                kycInstance: createKycContractCreator(),
                tokenInstance: createTrentTokenInstance(),
                tokenSaleInstance: createTrentTokenSaleInstance(),
            }, this.listenToPaymentEvent);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    listenToPaymentEvent = () => {
    }

    handleSubmitForKyc = async () => {
        const { data, kycInstance, accounts } = this.state;
        const [ firstAccount ] = accounts;
        const { kycAddress } = data;

        const transactionResponse = await kycInstance.methods.kycCompleted(kycAddress).send({from: firstAccount });
        console.log("Transaction: ", transactionResponse);
    }

    render() {
        const {web3, data} = this.state;
        if (!web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }

        return (
            <div className="App">
                <h1>TrentLoft Token Sale!</h1>
                <h2>KYC Whitelisting</h2>

                <p>Get your tokens today!</p>

                <div>
                    <h2>Get Whitelisted</h2>
                    <p>
                        <label>Address: </label>
                        <input type="text" name="kycAddress" value={data.kycAddress || ""} onChange={(event) => {
                            const name = event.target.name;
                            const value = event.target.value;
                            const newData = {...data};
                            newData[name] = value;
                            this.setState({data: newData});
                        }}/>
                    </p>
                    <p>
                        <button type="button" onClick={this.handleSubmitForKyc}>Add new whitelisted Address</button>
                    </p>
                </div>

            </div>
        );
    }
}

export default App;
