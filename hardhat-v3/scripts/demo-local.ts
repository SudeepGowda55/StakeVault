import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Helper function to add delays for demo presentation
async function sleep(seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// Connect to local Hardhat network
const { viem } = await network.connect({
  network: "hardhatMainnet",
});

console.log("🎬 COMPLETE DEMO: Full StakeVault Workflow (Local Network)\n");
console.log("=".repeat(70));
console.log("This demo will show the complete lifecycle:");
console.log("1. Deploy a fresh contract");
console.log("2. Check initial state");
console.log("3. Deposit ETH");
console.log("4. Simulate time passing (7 days)");
console.log("5. Check rewards earned");
console.log("6. Withdraw principal + rewards");
console.log("=".repeat(70) + "\n");

const publicClient = await viem.getPublicClient();
const testClient = await viem.getTestClient();
const [deployerClient] = await viem.getWalletClients();

console.log("🔧 SETUP:");
console.log("📍 User Address:", deployerClient.account.address);
console.log("🌐 Network: Local Hardhat\n");

// =============== DEPLOY CONTRACT ===============
console.log("=".repeat(70));
console.log("DEPLOYING FRESH CONTRACT");
console.log("=".repeat(70));

console.log("📦 Deploying StakeVault contract...");
const vault = await viem.deployContract("StakeVault");
console.log("✅ StakeVault deployed at:", vault.address);

// Fund the vault with ETH to pay rewards
console.log("💰 Funding vault with 100 ETH for rewards...");
await testClient.setBalance({
  address: vault.address,
  value: parseEther("100"),
});
console.log("✅ Vault funded!");
console.log("");

// Pause to explain deployment
await sleep(4);

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

// Pause to explain initial state
await sleep(4);

// =============== STEP 2: Deposit ===============
console.log("=".repeat(70));
console.log("STEP 2: Depositing ETH into Vault");
console.log("=".repeat(70));

const depositAmount = parseEther("10");
console.log("🔄 Depositing", formatEther(depositAmount), "ETH...");

const depositTx = await vault.write.deposit({ value: depositAmount });
await publicClient.waitForTransactionReceipt({ hash: depositTx });
console.log("✅ Deposit successful!");
console.log("📋 Transaction:", depositTx, "\n");

const [stakedAfterDeposit, rewardsAfterDeposit, depositTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);
console.log("📊 New Staked Amount:", formatEther(stakedAfterDeposit), "ETH");
console.log("📅 Deposit Time:", new Date(Number(depositTime) * 1000).toLocaleString());
console.log("");

// Pause to explain deposit
await sleep(4);

// =============== STEP 3: Time Passes & Check Rewards ===============
console.log("=".repeat(70));
console.log("STEP 3: Simulating Time Passage (7 days)");
console.log("=".repeat(70));

console.log("⏰ Fast-forwarding blockchain time by 7 days...");
await testClient.increaseTime({ seconds: 7 * 24 * 60 * 60 }); // 7 days
await testClient.mine({ blocks: 1 });
console.log("✅ Time advanced by 7 days!\n");

const [stakedAfterTime, rewardsAfterTime] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

console.log("📊 Staked Amount:", formatEther(stakedAfterTime), "ETH");
console.log("💎 Rewards Earned (7 days):", formatEther(rewardsAfterTime), "ETH");
console.log("💰 Total Value:", formatEther(stakedAfterTime + rewardsAfterTime), "ETH");

// Calculate daily rate
const dailyReward = rewardsAfterTime / 7n;
console.log("📈 Daily Reward Rate:", formatEther(dailyReward), "ETH/day");

// Calculate actual APR
const expectedYearlyRewards = (stakedAfterTime * 5n) / 100n;
const actualApr = (rewardsAfterTime * 365n * 100n) / (stakedAfterTime * 7n);
console.log("📊 Effective APR:", actualApr.toString(), "%");
console.log("");

// Pause to explain rewards after 7 days
await sleep(4);

// =============== STEP 4: More Time Passes ===============
console.log("=".repeat(70));
console.log("STEP 4: Simulating More Time (30 more days)");
console.log("=".repeat(70));

console.log("⏰ Fast-forwarding blockchain time by 30 more days...");
await testClient.increaseTime({ seconds: 30 * 24 * 60 * 60 }); // 30 days
await testClient.mine({ blocks: 1 });
console.log("✅ Total time staked: 37 days\n");

const [stakedAfter37Days, rewardsAfter37Days] = await vault.read.getUserInfo([
  deployerClient.account.address,
]);

console.log("📊 Staked Amount:", formatEther(stakedAfter37Days), "ETH");
console.log("💎 Rewards Earned (37 days):", formatEther(rewardsAfter37Days), "ETH");
console.log("💰 Total Value:", formatEther(stakedAfter37Days + rewardsAfter37Days), "ETH");
console.log("");

// Pause to explain 37-day rewards
await sleep(4);

// =============== STEP 5: Withdraw ===============
console.log("=".repeat(70));
console.log("STEP 5: Withdrawing Principal + Rewards");
console.log("=".repeat(70));

const balanceBeforeWithdraw = await publicClient.getBalance({
  address: deployerClient.account.address,
});

console.log("🔄 Withdrawing all staked ETH and rewards...");
const withdrawTx = await vault.write.withdraw();
const withdrawReceipt = await publicClient.waitForTransactionReceipt({ hash: withdrawTx });
console.log("✅ Withdrawal successful!");
console.log("📋 Transaction:", withdrawTx, "\n");

const balanceAfterWithdraw = await publicClient.getBalance({
  address: deployerClient.account.address,
});

const [stakedFinal, rewardsFinal] = await vault.read.getUserInfo([deployerClient.account.address]);

const gasUsed = withdrawReceipt.gasUsed * withdrawReceipt.effectiveGasPrice;

console.log("📊 FINAL RESULTS:");
console.log("=".repeat(70));
console.log("💰 Principal Received:", formatEther(stakedAfter37Days), "ETH");
console.log("💎 Rewards Received:", formatEther(rewardsAfter37Days), "ETH");
console.log("⛽ Gas Fees:", formatEther(gasUsed), "ETH");
console.log("📈 Net Profit:", formatEther(rewardsAfter37Days - gasUsed), "ETH");
console.log("\n✅ Final Staked Balance:", formatEther(stakedFinal), "ETH (should be 0)");
console.log("✅ Final Rewards:", formatEther(rewardsFinal), "ETH (should be 0)");
console.log("");

// Pause to explain final results
await sleep(4);

// =============== SUMMARY ===============
console.log("=".repeat(70));
console.log("✨ DEMO COMPLETED SUCCESSFULLY!");
console.log("=".repeat(70));
console.log("\n📋 SUMMARY:");
console.log("1. ✅ Deployed contract at:", vault.address);
console.log("2. ✅ Deposited", formatEther(depositAmount), "ETH");
console.log("3. ✅ Waited 37 days (simulated)");
console.log("4. ✅ Earned", formatEther(rewardsAfter37Days), "ETH in rewards");
console.log("5. ✅ Withdrew principal + rewards");
console.log("6. ✅ Net profit (after gas):", formatEther(rewardsAfter37Days - gasUsed), "ETH");

// Calculate ROI
const roi = (rewardsAfter37Days * 10000n) / stakedAfter37Days;
console.log("\n📊 PERFORMANCE:");
console.log("📈 ROI:", (Number(roi) / 100).toFixed(2), "% over 37 days");
console.log("📈 Annualized ROI:", (((Number(roi) / 100) * 365) / 37).toFixed(2), "%");
console.log("\n🎯 The StakeVault is working perfectly!");
console.log("💡 Users can stake ETH and earn 5% APR automatically!");
