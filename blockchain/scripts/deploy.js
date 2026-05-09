const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ChainMed SupplyChain contract...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contract
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();

  const contractAddress = await supplyChain.getAddress();
  console.log("SupplyChain deployed to:", contractAddress);

  // Register demo actors
  console.log("\nRegistering demo actors...");
  
  const signers = await ethers.getSigners();
  
  if (signers.length > 1) {
    await supplyChain.registerActor(signers[1].address, 1, "PharmaCorp Manufacturer");
    console.log("Registered manufacturer:", signers[1].address);
  }
  
  if (signers.length > 2) {
    await supplyChain.registerActor(signers[2].address, 2, "MediDist Distributor");
    console.log("Registered distributor:", signers[2].address);
  }
  
  if (signers.length > 3) {
    await supplyChain.registerActor(signers[3].address, 3, "CityPharmacy");
    console.log("Registered pharmacy:", signers[3].address);
  }
  
  if (signers.length > 4) {
    await supplyChain.registerActor(signers[4].address, 4, "General Hospital");
    console.log("Registered hospital:", signers[4].address);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Also save ABI for frontend
  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts", "SupplyChain.sol");
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
  
  if (fs.existsSync(artifactsDir) && !fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  console.log("\nDeployment complete!");
  console.log("Contract address:", contractAddress);
  console.log("Deployment saved to:", path.join(deploymentsDir, `${hre.network.name}.json`));
  console.log("\nAdd to frontend .env:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`VITE_RPC_URL=http://127.0.0.1:8545`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
