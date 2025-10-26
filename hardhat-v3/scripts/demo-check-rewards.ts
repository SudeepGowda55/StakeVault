import { network } from "hardhat";
import { formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🎬 DEMO: Checking Staking Rewards\n");
console.log("=".repeat(60));

const publicClient = await viem.getPublicClient();
const [deployerClient] = await viem.getWalletClients();

// Use the already deployed contract
const VAULT_ADDRESS = "0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75";
const vault = await viem.getContractAt("StakeVault", VAULT_ADDRESS);

console.log("📍 User Address:", deployerClient.account.address);
console.log("🏦 Vault Address:", vault.address);
console.log("\n" + "=".repeat(60));

// Get user info
const [stakedBalance, pendingRewards, depositTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

const totalDeposits = await vault.read.totalDeposits();

console.log("📊 YOUR STAKING DASHBOARD:");
console.log("=".repeat(60));

if (stakedBalance === 0n) {
  console.log("⚠️  No ETH currently staked");
  console.log("\n💡 Run the deposit demo first:");
  console.log("   npx hardhat run scripts/demo-deposit.ts");
} else {
  const depositDate = new Date(Number(depositTime) * 1000);
  const now = new Date();
  const timeStakedMs = now.getTime() - depositDate.getTime();
  const daysStaked = Math.floor(timeStakedMs / (1000 * 60 * 60 * 24));
  const hoursStaked = Math.floor((timeStakedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesStaked = Math.floor((timeStakedMs % (1000 * 60 * 60)) / (1000 * 60));

  console.log("💰 Staked Amount:", formatEther(stakedBalance), "ETH");
  console.log("💎 Pending Rewards:", formatEther(pendingRewards), "ETH");
  console.log("📈 Total Value:", formatEther(stakedBalance + pendingRewards), "ETH");
  console.log("\n⏰ Time Staked:");
  console.log(`   ${daysStaked} days, ${hoursStaked} hours, ${minutesStaked} minutes`);
  console.log("📅 Staked Since:", depositDate.toLocaleString());

  // Calculate APR projection
  const projectedYearlyRewards = (stakedBalance * 5n) / 100n;
  console.log("\n📊 Projections (5% APR):");
  console.log("   1 Day Rewards:", formatEther(projectedYearlyRewards / 365n), "ETH");
  console.log("   1 Month Rewards:", formatEther((projectedYearlyRewards * 30n) / 365n), "ETH");
  console.log("   1 Year Rewards:", formatEther(projectedYearlyRewards), "ETH");
}

console.log("\n🏦 VAULT STATISTICS:");
console.log("=".repeat(60));
console.log("📊 Total Deposits:", formatEther(totalDeposits), "ETH");
console.log("📈 Reward Rate: 5% APR");

console.log("\n🔗 View Contract:");
console.log(`   https://sepolia.etherscan.io/address/${vault.address}`);

if (stakedBalance > 0n) {
  console.log("\n💡 Ready to withdraw? Run:");
  console.log("   npx hardhat run scripts/demo-withdraw.ts");
}
