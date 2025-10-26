// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title StakeVault
 * @notice Simple ETH staking vault built with Hardhat v3
 * @dev Earn 5% APR on staked ETH - withdraw anytime
 */
contract StakeVault {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositTime;

    uint256 public totalDeposits;
    uint256 public constant REWARD_RATE = 5; // 5% APR
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 principal, uint256 reward);

    error ZeroDeposit();
    error NoBalance();
    error TransferFailed();

    /**
     * @notice Deposit ETH into the vault
     */
    function deposit() external payable {
        if (msg.value == 0) revert ZeroDeposit();

        balances[msg.sender] += msg.value;
        depositTime[msg.sender] = block.timestamp;
        totalDeposits += msg.value;

        emit Deposited(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice Calculate rewards earned based on time staked
     * @param user Address to calculate rewards for
     * @return reward Amount of reward earned
     */
    function calculateReward(
        address user
    ) public view returns (uint256 reward) {
        uint256 balance = balances[user];
        if (balance == 0) return 0;

        uint256 timeStaked = block.timestamp - depositTime[user];
        reward =
            (balance * REWARD_RATE * timeStaked) /
            (SECONDS_PER_YEAR * 100);
    }

    /**
     * @notice Withdraw staked ETH plus rewards
     */
    function withdraw() external {
        uint256 balance = balances[msg.sender];
        if (balance == 0) revert NoBalance();

        uint256 reward = calculateReward(msg.sender);
        uint256 total = balance + reward;

        balances[msg.sender] = 0;
        totalDeposits -= balance;

        (bool success, ) = msg.sender.call{value: total}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, balance, reward);
    }

    /**
     * @notice Get user's current balance and pending rewards
     * @param user Address to query
     * @return stakedBalance Amount of ETH staked
     * @return pendingReward Amount of reward pending
     * @return stakedSince Timestamp when user first staked
     */
    function getUserInfo(
        address user
    )
        external
        view
        returns (
            uint256 stakedBalance,
            uint256 pendingReward,
            uint256 stakedSince
        )
    {
        return (balances[user], calculateReward(user), depositTime[user]);
    }

    receive() external payable {
        if (msg.value > 0) {
            balances[msg.sender] += msg.value;
            depositTime[msg.sender] = block.timestamp;
            totalDeposits += msg.value;
            emit Deposited(msg.sender, msg.value, block.timestamp);
        }
    }
}
