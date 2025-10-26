import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🎬 DEMO: Depositing ETH into StakeVault\n");
console.log("=".repeat(60));

const publicClient = await viem.getPublicClient();
const [deployerClient] = await viem.getWalletClients();

// Use the already deployed contract
const VAULT_ADDRESS = "0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75";
const vault = await viem.getContractAt("StakeVault", VAULT_ADDRESS);

console.log("📍 User Address:", deployerClient.account.address);
console.log("🏦 Vault Address:", vault.address);

// Check balance before
const balanceBefore = await publicClient.getBalance({
  address: deployerClient.account.address,
});
console.log("💰 User Balance Before:", formatEther(balanceBefore), "ETH\n");

// Get vault info before
const [stakedBefore, rewardsBefore, depositTimeBefore] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);
console.log("📊 Current Stake:", formatEther(stakedBefore), "ETH");
console.log("💎 Current Rewards:", formatEther(rewardsBefore), "ETH\n");

// Deposit amount
const depositAmount = parseEther("0.005"); // 0.005 ETH
console.log("=".repeat(60));
console.log("🔄 Depositing", formatEther(depositAmount), "ETH into vault...\n");

const depositTx = await vault.write.deposit({ value: depositAmount });
console.log("⏳ Transaction sent:", depositTx);

await publicClient.waitForTransactionReceipt({ hash: depositTx });
console.log("✅ Transaction confirmed!\n");

// Check balance after
const balanceAfter = await publicClient.getBalance({
  address: deployerClient.account.address,
});

const [stakedAfter, rewardsAfter, depositTimeAfter] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

console.log("=".repeat(60));
console.log("📊 AFTER DEPOSIT:");
console.log("💰 User Balance:", formatEther(balanceAfter), "ETH");
console.log("📈 Total Staked:", formatEther(stakedAfter), "ETH");
console.log("💎 Pending Rewards:", formatEther(rewardsAfter), "ETH");
console.log("📅 Staked Since:", new Date(Number(depositTimeAfter) * 1000).toLocaleString());

const totalDeposits = await vault.read.totalDeposits();
console.log("\n🏦 Total Vault Deposits:", formatEther(totalDeposits), "ETH");

console.log("\n🔗 View on Etherscan:");
console.log(`   https://sepolia.etherscan.io/tx/${depositTx}`);
console.log("\n✨ Deposit successful! Your ETH is now earning 5% APR!");
