import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

// Connect to Sepolia network
const { viem } = await network.connect({
  network: "sepolia",
});

console.log("🎬 DEMO: Multi-User Staking Scenario\n");
console.log("=".repeat(70));
console.log("This demo shows multiple users interacting with the vault");
console.log("=".repeat(70) + "\n");

const publicClient = await viem.getPublicClient();
const [user1, user2, user3] = await viem.getWalletClients();

// Use the already deployed contract
const VAULT_ADDRESS = "0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75";
const vault = await viem.getContractAt("StakeVault", VAULT_ADDRESS);

console.log("🏦 Vault Address:", vault.address);
console.log("");

// Display users
const users = [
  { client: user1, name: "User 1 (Alice)", amount: "0.002" },
  { client: user2, name: "User 2 (Bob)", amount: "0.003" },
  { client: user3, name: "User 3 (Charlie)", amount: "0.001" },
];

console.log("👥 USERS:");
console.log("=".repeat(70));
users.forEach((user, i) => {
  console.log(`${i + 1}. ${user.name}`);
  console.log(`   Address: ${user.client.account.address}`);
  console.log(`   Will Stake: ${user.amount} ETH\n`);
});

// Check vault state before
const totalDepositsBefore = await vault.read.totalDeposits();
console.log("🏦 Vault Total Deposits (Before):", formatEther(totalDepositsBefore), "ETH\n");

// Each user deposits
console.log("=".repeat(70));
console.log("DEPOSITING FROM MULTIPLE USERS:");
console.log("=".repeat(70) + "\n");

for (let i = 0; i < users.length; i++) {
  const user = users[i];
  console.log(`💰 ${user.name} depositing ${user.amount} ETH...`);

  try {
    const depositTx = await vault.write.deposit({
      value: parseEther(user.amount),
      account: user.client.account,
    });

    await publicClient.waitForTransactionReceipt({ hash: depositTx });
    console.log(`   ✅ Success! Tx: ${depositTx.slice(0, 20)}...`);

    const [staked] = await vault.read.getUserInfo([user.client.account.address]);
    console.log(`   📊 ${user.name}'s Total Stake: ${formatEther(staked)} ETH\n`);
  } catch (error) {
    console.log(`   ⚠️  Note: This user may not have enough Sepolia ETH`);
    console.log(`   💡 Only User 1 has funded account in this demo\n`);
  }
}

// Check vault state after
const totalDepositsAfter = await vault.read.totalDeposits();
console.log("=".repeat(70));
console.log("📊 VAULT STATISTICS:");
console.log("=".repeat(70));
console.log("🏦 Total Deposits (Before):", formatEther(totalDepositsBefore), "ETH");
console.log("🏦 Total Deposits (After):", formatEther(totalDepositsAfter), "ETH");
console.log("📈 New Deposits:", formatEther(totalDepositsAfter - totalDepositsBefore), "ETH");
console.log("");

// Show individual user balances
console.log("=".repeat(70));
console.log("👥 INDIVIDUAL USER BALANCES:");
console.log("=".repeat(70));

let totalStakedSum = 0n;
for (const user of users) {
  const [staked, rewards] = await vault.read.getUserInfo([user.client.account.address]);
  totalStakedSum += staked;

  if (staked > 0n) {
    console.log(`\n${user.name}:`);
    console.log(`  📈 Staked: ${formatEther(staked)} ETH`);
    console.log(`  💎 Rewards: ${formatEther(rewards)} ETH`);
    console.log(`  💰 Total: ${formatEther(staked + rewards)} ETH`);
  }
}

console.log("\n" + "=".repeat(70));
console.log("✨ Multi-User Demo Completed!");
console.log("=".repeat(70));
console.log(`\n📊 Total Staked by All Users: ${formatEther(totalStakedSum)} ETH`);
console.log(`🏦 Vault Total Deposits: ${formatEther(totalDepositsAfter)} ETH`);
console.log("\n💡 Each user can independently withdraw their stake + rewards anytime!");
console.log(`🔗 View Vault: https://sepolia.etherscan.io/address/${vault.address}`);
