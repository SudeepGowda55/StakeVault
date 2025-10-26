# StakeVault - ETH Staking Protocol

**Built with Hardhat 3 Beta for ETHGlobal ETHOnline Hackathon**

StakeVault is a decentralized ETH staking protocol that enables users to earn 5% APR on their staked ETH. Users can deposit any amount of ETH and withdraw anytime with their earned rewards - no lock-up period required.

🔗 **Live Contract:** [0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75](https://sepolia.etherscan.io/address/0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75) (Sepolia)

## ✨ Features

- 💰 **5% APR Rewards** - Earn competitive returns on staked ETH
- ⚡ **Instant Withdrawals** - No lock-up period, withdraw anytime
- 🔒 **Secure & Tested** - 13 comprehensive tests (6 Solidity + 7 TypeScript)
- 📊 **Automatic Calculations** - Time-weighted rewards computed on-chain
- 🚀 **Gas Efficient** - Optimized with custom errors and minimal state changes

## 🎯 How It Works

1. **Deposit:** Users send ETH to the vault using the `deposit()` function
2. **Earn:** Rewards accumulate automatically at 5% APR based on time staked
3. **Withdraw:** Users can withdraw their principal + rewards anytime with `withdraw()`

**Reward Formula:**

```solidity
reward = (balance × 5% × time_staked) / 365_days
```

Example: Staking 10 ETH for 37 days earns ~0.05 ETH in rewards!

---

## 🛠️ Hardhat 3 Beta Implementation

This project showcases advanced Hardhat 3 Beta features using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about Hardhat 3 Beta, visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). Share feedback in the [Hardhat 3 Beta Telegram group](https://hardhat.org/hardhat3-beta-telegram-group) or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new).

### Technical Stack

- ⚡ **Hardhat 3.0.9** - Latest version with ESM support
- 📝 **Solidity 0.8.28** - Modern smart contract language
- 🔧 **Viem 2.38.4** - Type-safe Ethereum library
- 🧪 **Dual Testing** - Foundry-compatible Solidity tests + TypeScript integration tests
- 🌐 **Multiple Networks** - Local simulation (L1, Optimism) + Sepolia testnet

### Project Structure

```
hardhat-v3/
├── contracts/
│   ├── StakeVault.sol       # Main staking contract
│   └── StakeVault.t.sol     # Solidity unit tests (Foundry-style)
├── test/
│   └── StakeVault.ts        # TypeScript integration tests (node:test)
├── scripts/
│   ├── demo-local.ts        # Complete workflow demo (local network)
│   ├── demo-deposit.ts      # Deposit demo (Sepolia)
│   ├── demo-check-rewards.ts # Check rewards (Sepolia)
│   ├── demo-withdraw.ts     # Withdrawal demo (Sepolia)
│   └── interact.ts          # General interaction script
├── ignition/
│   └── modules/
│       └── StakeVault.ts    # Hardhat Ignition deployment module
└── hardhat.config.ts        # Hardhat 3 configuration
```

## Usage

### Quick Start

1. **Install dependencies:**

   ```shell
   npm install
   ```

2. **Set up environment variables:**

   ```shell
   cp .env.example .env
   # Edit .env with your SEPOLIA_RPC_URL and SEPOLIA_PRIVATE_KEY
   ```

3. **Run tests:**

   ```shell
   npx hardhat test
   ```

4. **Run local demo:**
   ```shell
   npx hardhat run scripts/demo-local.ts
   ```

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Demo Scripts

**Local Network Demo (Complete Workflow):**

```shell
npx hardhat run scripts/demo-local.ts
```

This simulates the entire staking lifecycle: deploy → deposit 10 ETH → fast-forward 37 days → withdraw with rewards. Perfect for presentations!

**Sepolia Testnet Demos:**

```shell
# Deposit ETH to vault
npx hardhat run scripts/demo-deposit.ts

# Check current rewards
npx hardhat run scripts/demo-check-rewards.ts

# Withdraw principal + rewards
npx hardhat run scripts/demo-withdraw.ts

# General interaction script
npx hardhat run scripts/interact.ts
```

### Make a deployment to Sepolia

This project includes a Hardhat Ignition module to deploy the StakeVault contract.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/StakeVault.ts
```

To run the deployment to Sepolia, you need an account with Sepolia ETH. The Hardhat configuration uses environment variables for your RPC URL and private key.

To run the deployment to Sepolia, you need an account with Sepolia ETH. The Hardhat configuration uses environment variables for your RPC URL and private key.

Set up your `.env` file:

```shell
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key (optional, for verification)
```

Then deploy to Sepolia:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/StakeVault.ts
```

## 📊 Test Results

All 13 tests passing:

**Solidity Tests (6):**

- ✅ Deposit functionality
- ✅ Reward calculations
- ✅ Withdrawal mechanics
- ✅ Zero deposit prevention
- ✅ No balance protection
- ✅ Fuzz testing with random amounts

**TypeScript Tests (7):**

- ✅ Contract deployment
- ✅ Deposit events
- ✅ Balance tracking
- ✅ Time-based rewards
- ✅ Full withdrawal flow
- ✅ Multiple user scenarios
- ✅ Edge case handling

## 🎯 Smart Contract Functions

### User Functions

**`deposit()`** - Deposit ETH to start earning rewards

```solidity
function deposit() external payable
```

**`withdraw()`** - Withdraw principal + accumulated rewards

```solidity
function withdraw() external
```

**`calculateReward(address user)`** - View pending rewards

```solidity
function calculateReward(address user) public view returns (uint256)
```

**`getUserInfo(address user)`** - Get staked balance, rewards, and deposit time

```solidity
function getUserInfo(address user) public view returns (uint256, uint256, uint256)
```

### Public Variables

- `balances` - Mapping of user addresses to staked amounts
- `depositTime` - Mapping of user addresses to deposit timestamps
- `totalDeposits` - Total ETH staked in the vault
- `REWARD_RATE` - 5% APR (constant)

## 🔒 Security Features

- ✅ Custom errors for gas efficiency (`ZeroDeposit`, `NoBalance`, `TransferFailed`)
- ✅ Checks-Effects-Interactions pattern
- ✅ Comprehensive event logging
- ✅ No external dependencies or complex DeFi interactions
- ✅ Fuzz tested with randomized inputs

## 📈 Performance Metrics

- **Deployment Gas:** ~350,000 gas
- **Deposit Gas:** ~50,000 gas
- **Withdraw Gas:** ~60,000 gas
- **Contract Size:** Optimized and well under limit

## 🎥 Demo Video

For a complete walkthrough, check out `DEMO-VIDEO-SCRIPT.md` which includes:

- Step-by-step video recording guide
- Talking points for each section
- Commands to execute in order
- Tips for filming and presentation

## 🌐 Network Configuration

The project is configured for three networks:

1. **hardhatMainnet** - Local L1 simulation with time manipulation
2. **hardhatOp** - Local Optimism simulation
3. **sepolia** - Ethereum Sepolia testnet (live deployment)

## 🚀 Hardhat 3 Features Utilized

- ✅ ESM module system (import/export)
- ✅ New `network.connect()` API
- ✅ Type-safe configuration with explicit network types
- ✅ `@nomicfoundation/hardhat-toolbox-viem` for integrated tooling
- ✅ Viem integration for modern TypeScript interactions
- ✅ Native Node.js test runner support
- ✅ Foundry-compatible Solidity tests

## 📝 License

MIT

## 🤝 Contributing

This project was built for the ETHGlobal ETHOnline Hackathon. Feel free to fork and build upon it!

## 🔗 Links

- **Live Contract:** [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75)
- **Hardhat 3 Docs:** [hardhat.org](https://hardhat.org/docs/getting-started)
- **Viem Docs:** [viem.sh](https://viem.sh/)

---

**Built with ❤️ using Hardhat 3 Beta**
