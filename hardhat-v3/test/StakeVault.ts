import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther } from "viem";

describe("StakeVault", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();
  const [deployer, user1, user2] = await viem.getWalletClients();

  it("Should allow deposits and track balances correctly", async function () {
    const vault = await viem.deployContract("StakeVault");

    // Deposit 10 ETH
    await vault.write.deposit({ value: parseEther("10") });

    // Check balance
    const balance = await vault.read.balances([deployer.account.address]);
    assert.equal(balance, parseEther("10"));

    const totalDeposits = await vault.read.totalDeposits();
    assert.equal(totalDeposits, parseEther("10"));
  });

  it("Should emit the Deposited event when depositing ETH", async function () {
    const vault = await viem.deployContract("StakeVault");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    await vault.write.deposit({ value: parseEther("1") });

    // Get the events from the transaction
    const events = await publicClient.getContractEvents({
      address: vault.address,
      abi: vault.abi,
      eventName: "Deposited",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    assert.equal(events.length, 1);
    // Use toLowerCase() to compare addresses case-insensitively
    assert.equal(events[0].args.user?.toLowerCase(), deployer.account.address.toLowerCase());
    assert.equal(events[0].args.amount, parseEther("1"));
  });

  it("Should calculate rewards correctly after time passes", async function () {
    const vault = await viem.deployContract("StakeVault");

    // Deposit 100 ETH
    await vault.write.deposit({ value: parseEther("100") });

    // Fast forward 365 days (31536000 seconds)
    await testClient.increaseTime({ seconds: 31536000 });
    await testClient.mine({ blocks: 1 });

    // Calculate reward - should be 5 ETH (5% of 100 ETH)
    const reward = (await vault.read.calculateReward([deployer.account.address])) as bigint;

    // Allow small margin for rounding
    assert.ok(reward >= parseEther("4.99") && reward <= parseEther("5.01"));
  });

  it("Should allow withdrawals with rewards", async function () {
    const vault = await viem.deployContract("StakeVault");

    // Deposit 10 ETH (which will be held in the contract)
    await vault.write.deposit({ value: parseEther("10") });

    // Fund the vault with additional ETH to cover rewards via receive function
    await testClient.setBalance({
      address: vault.address,
      value: parseEther("100"),
    });

    // Fast forward 30 days
    await testClient.increaseTime({ seconds: 30 * 24 * 60 * 60 });
    await testClient.mine({ blocks: 1 });

    // Withdraw
    await vault.write.withdraw();

    // Check vault balance is 0 after withdrawal
    const vaultBalance = await vault.read.balances([deployer.account.address]);
    assert.equal(vaultBalance, 0n, "Vault balance should be 0 after withdrawal");
  });

  it("Should handle multiple users depositing", async function () {
    const vault = await viem.deployContract("StakeVault");

    // User 1 deposits
    await vault.write.deposit({
      value: parseEther("5"),
      account: user1.account,
    });

    // User 2 deposits
    await vault.write.deposit({
      value: parseEther("10"),
      account: user2.account,
    });

    const user1Balance = await vault.read.balances([user1.account.address]);
    const user2Balance = await vault.read.balances([user2.account.address]);
    const totalDeposits = await vault.read.totalDeposits();

    assert.equal(user1Balance, parseEther("5"));
    assert.equal(user2Balance, parseEther("10"));
    assert.equal(totalDeposits, parseEther("15"));
  });

  it("Should revert when depositing zero ETH", async function () {
    const vault = await viem.deployContract("StakeVault");

    await viem.assertions.revertWithCustomError(
      vault.write.deposit({ value: 0n }),
      vault,
      "ZeroDeposit"
    );
  });

  it("Should revert when withdrawing with no balance", async function () {
    const vault = await viem.deployContract("StakeVault");

    await viem.assertions.revertWithCustomError(vault.write.withdraw(), vault, "NoBalance");
  });
});
