import { network } from "hardhat";
import { formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🎬 DEMO: Withdrawing ETH + Rewards from StakeVault\n");
console.log("=".repeat(60));

const publicClient = await viem.getPublicClient();
const [deployerClient] = await viem.getWalletClients();

// Use the already deployed contract
const VAULT_ADDRESS = "0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75";
const vault = await viem.getContractAt("StakeVault", VAULT_ADDRESS);

console.log("📍 User Address:", deployerClient.account.address);
console.log("🏦 Vault Address:", vault.address);

// Get info before withdrawal
const balanceBefore = await publicClient.getBalance({
  address: deployerClient.account.address,
});

const [stakedBalance, pendingRewards, depositTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

console.log("\n📊 BEFORE WITHDRAWAL:");
console.log("=".repeat(60));
console.log("💰 Wallet Balance:", formatEther(balanceBefore), "ETH");
console.log("📈 Staked Amount:", formatEther(stakedBalance), "ETH");
console.log("💎 Pending Rewards:", formatEther(pendingRewards), "ETH");
console.log("💵 Total to Receive:", formatEther(stakedBalance + pendingRewards), "ETH");

if (stakedBalance === 0n) {
  console.log("\n⚠️  No ETH to withdraw!");
  console.log("💡 Run the deposit demo first:");
  console.log("   npx hardhat run scripts/demo-deposit.ts");
  process.exit(0);
}

const depositDate = new Date(Number(depositTime) * 1000);
const now = new Date();
const timeStakedMs = now.getTime() - depositDate.getTime();
const daysStaked = Math.floor(timeStakedMs / (1000 * 60 * 60 * 24));
const hoursStaked = Math.floor((timeStakedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutesStaked = Math.floor((timeStakedMs % (1000 * 60 * 60)) / (1000 * 60));

console.log(`⏰ Time Staked: ${daysStaked} days, ${hoursStaked} hours, ${minutesStaked} minutes`);
console.log("📅 Staked Since:", depositDate.toLocaleString());

console.log("\n" + "=".repeat(60));
console.log("🔄 Withdrawing all staked ETH and rewards...\n");

const withdrawTx = await vault.write.withdraw();
console.log("⏳ Transaction sent:", withdrawTx);

const receipt = await publicClient.waitForTransactionReceipt({ hash: withdrawTx });
console.log("✅ Transaction confirmed!\n");

// Get info after withdrawal
const balanceAfter = await publicClient.getBalance({
  address: deployerClient.account.address,
});

const [stakedAfter, rewardsAfter] = await vault.read.getUserInfo([deployerClient.account.address]);

const totalDeposits = await vault.read.totalDeposits();

console.log("=".repeat(60));
console.log("📊 AFTER WITHDRAWAL:");
console.log("=".repeat(60));
console.log("💰 Wallet Balance:", formatEther(balanceAfter), "ETH");
console.log("📈 Staked Amount:", formatEther(stakedAfter), "ETH");
console.log("💎 Pending Rewards:", formatEther(rewardsAfter), "ETH");

const netReceived = balanceAfter - balanceBefore;
const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice;

console.log("\n💸 TRANSACTION DETAILS:");
console.log("=".repeat(60));
console.log("✅ Principal Received:", formatEther(stakedBalance), "ETH");
console.log("💰 Rewards Received:", formatEther(pendingRewards), "ETH");
console.log("⛽ Gas Used:", formatEther(gasUsed), "ETH");
console.log("📈 Net Profit:", formatEther(pendingRewards - gasUsed), "ETH");

console.log("\n🏦 Vault Total Deposits:", formatEther(totalDeposits), "ETH");

console.log("\n🔗 View Transaction:");
console.log(`   https://sepolia.etherscan.io/tx/${withdrawTx}`);

console.log("\n✨ Withdrawal successful! You received your stake + rewards!");
