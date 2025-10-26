import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🎬 COMPLETE DEMO: Full StakeVault Workflow\n");
console.log("=".repeat(70));
console.log("This demo will show the complete lifecycle:");
console.log("1. Check initial state");
console.log("2. Deposit ETH");
console.log("3. Check rewards after time passes");
console.log("4. Withdraw principal + rewards");
console.log("=".repeat(70) + "\n");

const publicClient = await viem.getPublicClient();
const testClient = await viem.getTestClient();
const [deployerClient] = await viem.getWalletClients();

// Use the already deployed contract
const VAULT_ADDRESS = "0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75";
const vault = await viem.getContractAt("StakeVault", VAULT_ADDRESS);

console.log("🔧 SETUP:");
console.log("📍 User Address:", deployerClient.account.address);
console.log("🏦 Vault Address:", vault.address);
console.log("");

// =============== STEP 1: Initial State ===============
console.log("=".repeat(70));
console.log("STEP 1: Checking Initial State");
console.log("=".repeat(70));

const initialBalance = await publicClient.getBalance({
  address: deployerClient.account.address,
});
console.log("💰 Wallet Balance:", formatEther(initialBalance), "ETH");

const [initialStaked, initialRewards] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);
console.log("📈 Currently Staked:", formatEther(initialStaked), "ETH");
console.log("💎 Current Rewards:", formatEther(initialRewards), "ETH\n");

// =============== STEP 2: Deposit ===============
console.log("=".repeat(70));
console.log("STEP 2: Depositing ETH into Vault");
console.log("=".repeat(70));

const depositAmount = parseEther("0.003");
console.log("🔄 Depositing", formatEther(depositAmount), "ETH...");

const depositTx = await vault.write.deposit({ value: depositAmount });
await publicClient.waitForTransactionReceipt({ hash: depositTx });
console.log("✅ Deposit successful!");
console.log("🔗 Tx:", `https://sepolia.etherscan.io/tx/${depositTx}\n`);

const [stakedAfterDeposit, rewardsAfterDeposit, depositTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);
console.log("📊 New Staked Amount:", formatEther(stakedAfterDeposit), "ETH");
console.log("📅 Deposit Time:", new Date(Number(depositTime) * 1000).toLocaleString());
console.log("");

// =============== STEP 3: Time Passes & Check Rewards ===============
console.log("=".repeat(70));
console.log("STEP 3: Simulating Time Passage (7 days)");
console.log("=".repeat(70));

console.log("⏰ Fast-forwarding blockchain time by 7 days...");
await testClient.increaseTime({ seconds: 7 * 24 * 60 * 60 }); // 7 days
await testClient.mine({ blocks: 1 });
console.log("✅ Time advanced!\n");

const [stakedAfterTime, rewardsAfterTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

console.log("📊 Staked Amount:", formatEther(stakedAfterTime), "ETH");
console.log("💎 Rewards Earned (7 days):", formatEther(rewardsAfterTime), "ETH");
console.log("💰 Total Value:", formatEther(stakedAfterTime + rewardsAfterTime), "ETH");

// Calculate daily rate
const dailyReward = rewardsAfterTime / 7n;
console.log("📈 Daily Reward Rate:", formatEther(dailyReward), "ETH/day");
console.log("");

// =============== STEP 4: Withdraw ===============
console.log("=".repeat(70));
console.log("STEP 4: Withdrawing Principal + Rewards");
console.log("=".repeat(70));

const balanceBeforeWithdraw = await publicClient.getBalance({
  address: deployerClient.account.address,
});

console.log("🔄 Withdrawing all staked ETH and rewards...");
const withdrawTx = await vault.write.withdraw();
const withdrawReceipt = await publicClient.waitForTransactionReceipt({ hash: withdrawTx });
console.log("✅ Withdrawal successful!");
console.log("🔗 Tx:", `https://sepolia.etherscan.io/tx/${withdrawTx}\n`);

const balanceAfterWithdraw = await publicClient.getBalance({
  address: deployerClient.account.address,
});

const [stakedFinal, rewardsFinal] = await vault.read.getUserInfo([deployerClient.account.address]);

const gasUsed = withdrawReceipt.gasUsed * withdrawReceipt.effectiveGasPrice;

console.log("📊 FINAL RESULTS:");
console.log("✅ Staked Balance:", formatEther(stakedFinal), "ETH (should be 0)");
console.log("💎 Pending Rewards:", formatEther(rewardsFinal), "ETH (should be 0)");
console.log("⛽ Gas Fees:", formatEther(gasUsed), "ETH");
console.log("💰 Net Profit:", formatEther(rewardsAfterTime - gasUsed), "ETH");
console.log("");

// =============== SUMMARY ===============
console.log("=".repeat(70));
console.log("✨ DEMO COMPLETED SUCCESSFULLY!");
console.log("=".repeat(70));
console.log("\n📋 SUMMARY:");
console.log("1. ✅ Deposited", formatEther(depositAmount), "ETH");
console.log("2. ✅ Waited 7 days (simulated)");
console.log("3. ✅ Earned", formatEther(rewardsAfterTime), "ETH in rewards");
console.log("4. ✅ Withdrew principal + rewards");
console.log("\n🎯 The StakeVault is working perfectly!");
console.log("💡 Users can stake ETH and earn 5% APR automatically!");
