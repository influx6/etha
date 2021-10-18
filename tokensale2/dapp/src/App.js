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
        data: {
            kycAddress: null,
            tokenSaleAddress: null,
            tokenAddress: null,
            tokenAmountForUser: 0,
            tokenAmountToPurchase: 0,
            addressForTokenPurchase: null,
        },
    };

    componentDidMount = async () => {
        const { data } = this.state;
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            // 1. get current network id which tells us which network is currently used.
            const networkId = await web3.eth.net.getId();
            const KycCotractNetwork = KycContract.networks[networkId];
            const TrentTokenSaleNetwork = TrentTokenSale.networks[networkId];
            const TrentTokenNetwork = TrentToken.networks[networkId];

            const createKycContractCreator = () => {
                // 2. current smart contract address for current networkId.
                const network = KycCotractNetwork;
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    KycContract.abi,
                    network && network.address,
                );
            }

            const createTrentTokenSaleInstance = () => {
                // 2. current smart contract address for current networkId.
                const network = TrentTokenSaleNetwork;
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    TrentTokenSale.abi,
                    network && network.address,
                );
            }

            const createTrentTokenInstance = () => {
                // 2. current smart contract address for current networkId.
                const network = TrentTokenNetwork;
                console.log("Creating user with networkId: ", networkId, network);
                // 3. create an instance of the contract.
                return new web3.eth.Contract(
                    TrentToken.abi,
                    network && network.address,
                );
            }

            console.log("TokenSaleContract: ", TrentTokenSale, TrentTokenSaleNetwork, TrentTokenSaleNetwork.address)

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({
                web3,
                accounts,
                networkId,
                kycInstance: createKycContractCreator(),
                tokenInstance: createTrentTokenInstance(),
                tokenSaleInstance: createTrentTokenSaleInstance(),
                data: { ...data, tokenSaleAddress: TrentTokenSaleNetwork.address, tokenAddress: TrentTokenNetwork.address,},
            }, this.listenToTokensTransfer);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    listenToTokensTransfer = async () => {
        const { tokenInstance, accounts } = this.state;

        await this.loadUserTokens();
        tokenInstance.events.Transfer({to: accounts[0] }).on("data", async () => {
            await this.loadUserTokens();
        });
    }

    loadUserTokens = async () => {
        const { tokenInstance, accounts, data } = this.state;
        let tokensAmount = await tokenInstance.methods.balanceOf(accounts[0]).call();
        this.setState({data: {...data, tokenAmountForUser: tokensAmount }});
    }

    handleSubmitForKyc = async () => {
        const {  data, kycInstance, accounts } = this.state;
        const [ firstAccount ] = accounts;
        const { kycAddress } = data;

        console.log("KYC started for: ", kycAddress);

        const transactionResponse = await kycInstance.methods.setKycCompleted(kycAddress).send({from: firstAccount });
        console.log("Transaction: ", transactionResponse);
        console.log("KYC completed for: ", kycAddress);
    }

    handleSubmitForTokenPurchase = async () => {
        const { web3, data, tokenSaleInstance, accounts } = this.state;
        const [ firstAccount ] = accounts;
        const { tokenAmountToPurchase } = data;
        await tokenSaleInstance.methods.buyTokens(firstAccount).send({
            from: firstAccount,
            value: web3.utils.toWei(tokenAmountToPurchase, "wei"),
        });
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
                <p>User current has TrentTokens: {data.tokenAmountForUser}!</p>

                <p>If you wish to buy tokens send Wei to this address: {data.tokenSaleAddress}!</p>
                <p>TrentToken are deployed to: {data.tokenAddress}!</p>

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


                <div>
                    <h2>Buy more tokens</h2>
                    <p>
                        <input type="text" name="tokenAmountToPurchase" value={data.tokenAmountToPurchase || 0.0} onChange={(event) => {
                            const name = event.target.name;
                            const value = event.target.value;
                            const newData = {...data};
                            newData[name] = value;
                            this.setState({data: newData});
                        }}/>
                        <button type="button" onClick={this.handleSubmitForTokenPurchase}>Purchase TrentTokens</button>
                    </p>
                </div>
            </div>
        );
    }
}

export default App;
