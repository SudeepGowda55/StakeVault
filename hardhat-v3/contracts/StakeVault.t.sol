// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {StakeVault} from "./StakeVault.sol";

contract StakeVaultTest is Test {
    StakeVault public vault;
    address user1 = address(0x1);
    address user2 = address(0x2);

    function setUp() public {
        vault = new StakeVault();
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        // Fund the vault contract with ETH to pay rewards
        vm.deal(address(vault), 100 ether);
    }

    function test_Deposit() public {
        vm.prank(user1);
        vault.deposit{value: 1 ether}();

        assertEq(vault.balances(user1), 1 ether);
        assertEq(vault.totalDeposits(), 1 ether);
    }

    function test_RevertWhen_DepositZero() public {
        vm.prank(user1);
        vm.expectRevert(StakeVault.ZeroDeposit.selector);
        vault.deposit{value: 0}();
    }

    function testFuzz_Deposit(uint96 amount) public {
        vm.assume(amount > 0);
        vm.assume(amount <= 100 ether); // Ensure amount doesn't exceed user balance

        vm.prank(user1);
        vault.deposit{value: amount}();

        assertEq(vault.balances(user1), amount);
    }

    function test_CalculateReward() public {
        vm.prank(user1);
        vault.deposit{value: 100 ether}();

        // Fast forward 365 days
        vm.warp(block.timestamp + 365 days);

        uint256 reward = vault.calculateReward(user1);
        assertEq(reward, 5 ether); // 5% of 100 ETH
    }

    function test_Withdraw() public {
        vm.prank(user1);
        vault.deposit{value: 10 ether}();

        // Fast forward 30 days
        vm.warp(block.timestamp + 30 days);

        uint256 balanceBefore = user1.balance;

        vm.prank(user1);
        vault.withdraw();

        uint256 balanceAfter = user1.balance;

        assertGt(balanceAfter, balanceBefore + 10 ether);
        assertEq(vault.balances(user1), 0);
    }

    function test_RevertWhen_WithdrawWithNoBalance() public {
        vm.prank(user1);
        vm.expectRevert(StakeVault.NoBalance.selector);
        vault.withdraw();
    }
}
