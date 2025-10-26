import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🚀 Deploying StakeVault to Ethereum Sepolia...\n");

const publicClient = await viem.getPublicClient();
const [deployerClient] = await viem.getWalletClients();

console.log("📍 Deployer address:", deployerClient.account.address);

// Check deployer balance
const balance = await publicClient.getBalance({
  address: deployerClient.account.address,
});
console.log("💰 Deployer balance:", formatEther(balance), "ETH\n");

if (balance < parseEther("0.01")) {
  console.log("⚠️  Warning: Low balance! You need Sepolia ETH for deployment.");
  console.log("   Get Sepolia ETH from: https://sepoliafaucet.com/\n");
}

// Deploy the StakeVault contract
console.log("📦 Deploying StakeVault contract...");
const vault = await viem.deployContract("StakeVault");
console.log("✅ StakeVault deployed at:", vault.address);
console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${vault.address}\n`);

// Interact with the deployed contract
console.log("🔄 Testing contract interactions...\n");

// 1. Deposit ETH
console.log("1️⃣  Depositing 0.01 ETH...");
const depositTx = await vault.write.deposit({ value: parseEther("0.01") });
await publicClient.waitForTransactionReceipt({ hash: depositTx });
console.log("   ✅ Deposit successful!");
console.log("   🔗 Tx:", `https://sepolia.etherscan.io/tx/${depositTx}\n`);

// 2. Check balance
console.log("2️⃣  Checking staked balance...");
const stakedBalance = await vault.read.balances([deployerClient.account.address]);
console.log("   💎 Staked balance:", formatEther(stakedBalance), "ETH\n");

// 3. Get user info
console.log("3️⃣  Getting user info...");
const userInfo = await vault.read.getUserInfo([deployerClient.account.address]);
console.log("   📊 Staked:", formatEther(userInfo[0]), "ETH");
console.log("   💰 Pending rewards:", formatEther(userInfo[1]), "ETH");
console.log("   📅 Staked since:", new Date(Number(userInfo[2]) * 1000).toLocaleString(), "\n");

// 4. Check total deposits
const totalDeposits = await vault.read.totalDeposits();
console.log("4️⃣  Total deposits in vault:", formatEther(totalDeposits), "ETH\n");

console.log("✨ All interactions completed successfully!");
console.log("\n📝 Contract Summary:");
console.log("   Address:", vault.address);
console.log("   Network: Ethereum Sepolia");
console.log("   Reward Rate: 5% APR");
console.log("   Your Stake:", formatEther(stakedBalance), "ETH");
console.log(
  "\n💡 To withdraw later, call vault.withdraw() after some time has passed to earn rewards!"
);
