const fs = require("fs");
const path = require("path");


const main = async () => {
	if (network.name === "hardhat") {
		console.warn("Deploying contract to hardhat network which never persists and any funds sent in are lost. Consider using localhost network or a test network");
	}
	// get signers
	const signers = await ethers.getSigners();
	const [deployer] = signers

	const deployerAddress = await deployer.getAddress();
	const deployerBalance = await deployer.getBalance();
	console.log(`Deploying contract with account address: ${deployerAddress} with balance ${deployerBalance.toString()}`);


  // compile contract
  const contractFactory = await hre.ethers.getContractFactory("MemoContract");

  // deploy contract
  const memoContractInstance = await contractFactory.deploy();

  // check if its deployed.
  await memoContractInstance.deployed();

  console.log("Deployed memo contract %s", memoContractInstance.address);

  const memoContractFile = saveContractABIToFile(memoContractInstance, "MemoContract");

  console.log("Saved contract details to: %s", memoContractFile);
}

const saveContractABIToFile = (contractInstance, contractName) => {
	const distDir = path.join(__dirname, "../..", "dist");
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir);
	}

	const contractABI = artifacts.readArtifactSync("MemoContract");
	const contractFile = path.join(distDir,`${contractName}.contract.json`);
	fs.writeFileSync(contractFile, JSON.stringify({
		"contractAddress": contractInstance.address,
		"contractABI": contractABI,
	}, null, 2));
	return contractFile;
}

main()
  .then((d) => process.exit(0))
  .catch((e) => {
    console.log("Failed to deploy contract: ", e);
    process.exit(1);
  });
