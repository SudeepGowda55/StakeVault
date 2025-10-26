## 📑 Table of Contents

- [📝 Avail Nexus SDK Documentation Feedback](#-avail-nexus-sdk-documentation-feedback)
- [🏦 Sample Project: StakeVault ETH Staking Protocol](#-sample-project-stakevault-eth-staking-protocol)


# Avail-Nexus-SDK-Feedback

## 1. Sample Projects & End-to-End Examples

### Current Gap

The documentation lacks complete, working sample projects that developers can clone and run immediately. While there's a basic demo repository, it doesn't cover diverse real-world use cases that would help developers understand the full SDK potential.

### Recommendation: Add Complete Sample Projects

**Purpose**: Provide end-to-end working examples that developers can:
- Clone and run in under 5 minutes
- Use as starting templates for their own projects
- Reference for implementation patterns
- Learn best practices from production-ready code

### Suggested Sample Projects to Add:

#### 1. Cross-Chain Payment Processor
- Accept payments from any chain
- Merchant dashboard with unified balances
- Webhook integration examples
- Production deployment configuration
- **Tech Stack**: Next.js + Nexus Widgets + PostgreSQL

#### 2. Multi-Chain DeFi Dashboard
- Portfolio aggregation across chains
- One-click rebalancing to highest yields
- Integration with Aave, Compound, Uniswap
- Real-time analytics
- **Tech Stack**: React + Nexus Core + The Graph

#### 3. Social Tipping Platform
- Peer-to-peer cross-chain tips
- Creator earnings dashboard
- Tip consolidation features
- **Tech Stack**: Next.js + Nexus Widgets + IPFS

#### 4. Gaming Treasury Manager
- Multi-chain tournament registration
- Prize pool distribution across chains
- Multi-sig integration for guild management
- **Tech Stack**: Next.js + Safe + Nexus SDK

#### 5. Cross-Chain Invoice System
- Business invoice creation and management
- Multi-chain payment acceptance
- Automated currency conversion
- Accounting exports
- **Tech Stack**: Next.js + Nexus Core + PostgreSQL

---

## 2. Interactive API Reference Documentation

![Interactive API Documentation Example](https://github.com/user-attachments/assets/feec7cfd-1141-497e-ada8-2fbcedab1b58)

### Current Gap

The API reference documentation at https://docs.availproject.org/nexus/avail-nexus-sdk/nexus-core/api-reference currently contains only static code examples. While the code snippets are comprehensive, developers cannot interact with the API directly from the documentation.

### Recommendation: Add Interactive API Interface

**Inspiration**: The Pyth Network's Hermes API documentation (https://hermes.pyth.network/docs/) provides an excellent example of interactive API documentation with:
- Live request builders where developers can test endpoints directly
- Real-time response visualization
- Parameter input fields with validation
- Automatic code generation for multiple languages
- Authentication testing within the docs (reduces the hassle of tokens)

---

## 3. Missing: Gas/Fee Estimation API Reference

**Current Issue**: The documentation lacks a dedicated API reference section for gas and fee estimation, which is critical for developers building production applications where users need to understand transaction costs upfront.


**Why This Matters**:
- Users need to know transaction costs before committing
- Developers can show accurate fee breakdowns in UI
- Helps with UX design decisions (show warnings for high gas)
- Essential for budgeting in production applications

---

## 4. Missing: Response Format Clarity and Decoded Values

**Current Issue**: The API responses contain complex hexadecimal and encoded data that is difficult for developers to interpret without additional decoding steps. The documentation doesn't explain how to decode these values or provide human-readable examples.

### Problem Example:

When calling blockchain APIs, developers receive responses like:

```
{
"data": {
"binary": {
"encoding": "hex",
"data": ["504e41550000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000016f4929"]
},
"parsed": [{
"id": "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
"price": {
"price": "6163260000000",
"conf": "3268548079",
"expo": -8,
"publish_time": 1714748300
},
"ema_price": {
"price": "6130098800000",
"conf": "3587162000",
"expo": -8,
"publish_time": 1714748300
},
"metadata": {
"slot": 138886134,
"proof_available_time": 1714748302,
"prev_publish_time": 1714748300
}
}]
}
}
```


**Issues**:
- Hexadecimal data (`0x504e4155...`) is not human-readable
- Price values (`"6163260000000"`) need exponential conversion
- Unix timestamps need date conversion
- No explanation of what each field represents

### Recommended Solution:

#### 1. Add "Decoded Response Examples" Section

For every API endpoint, provide both raw and decoded responses side-by-side:

**Raw Response**:
```
{
"transactionHash": "0x8e5a3b2c1d4f6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
"amount": "0x5f5e100",
"gasUsed": "0x1a2b3",
"effectiveGasPrice": "0x3b9aca00"
}
```

**Decoded Response (Human-Readable)**:
```
{
"transactionHash": "0x8e5a...0f1a",
"amount": "100.00 USDC", // 0x5f5e100 = 100,000,000 (6 decimals) = 100 USDC
"gasUsed": "107,187 gas", // 0x1a2b3 = 107,187
"effectiveGasPrice": "1 Gwei", // 0x3b9aca00 = 1,000,000,000 wei = 1 Gwei
"totalGasCostInEth": "0.000107187 ETH", // gasUsed × effectiveGasPrice
"totalGasCostInUsd": "$0.31" // at ETH price of $2,900
}
```


#### 2. Add Parameter Explanations with Examples

For complex response fields, provide detailed explanations:

**Response Field Explanations**

| Field | Raw Value | Decoded Value | Explanation |
|-------|-----------|---------------|-------------|
| `price` | `"6163260000000"` | `$61,632.60` | Price with 8 decimal places. Divide by 10^8 (expo: -8) |
| `conf` | `"3268548079"` | `±$32.69` | Confidence interval (price uncertainty) |
| `publish_time` | `1714748300` | `May 3, 2024 14:45:00 GMT` | Unix timestamp |
| `gasUsed` | `"0x1a2b3"` | `107,187` | Hexadecimal to decimal conversion |
| `amount` | `"0x5f5e100"` | `100.00 USDC` | Wei to token units (6 decimals for USDC) |

#### 3. Add Conversion Utilities Documentation

Document utility functions for common conversions

## 4. Add Explorer Links for Transactions

**Current Issue**: When transactions are submitted, developers receive transaction hashes but no direct links to blockchain explorers.

**Recommended Addition**: Automatically include explorer links in all transaction responses:

```
{
"success": true,
"transactionHash": "0x8e5a3b2c1d4f6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
"chainId": 1,
"explorerLinks": {
"transaction": "https://etherscan.io/tx/0x8e5a...0f1a",
"fromAddress": "https://etherscan.io/address/0x742d...",
"toAddress": "https://etherscan.io/address/0x456a...",
"token": "https://etherscan.io/token/0xa0b8..."
},
"qrCode": "https://api.nexus.avail.network/qr/tx/0x8e5a...0f1a"
}
```

**Benefits**:
- One-click transaction verification
- Easy sharing with users/support
- Quick debugging of failed transactions
- Better transparency and trust


# 🏦 StakeVault - ETH Staking Protocol

A decentralized Ethereum staking protocol built with **Hardhat v3** for the ETHGlobal ETHOnline hackathon. Stake ETH, earn 5% APR, and withdraw anytime with no lock-up period.

🔗 **Live Contract:** [0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75](https://sepolia.etherscan.io/address/0xf8c7cce6a80140b6c6cba4fe9ca172b6c544fe75) (Sepolia)

## ✨ Features

- 💰 **5% APR Rewards** - Earn competitive returns on staked ETH
- 🔄 **Instant Withdrawals** - No lock-up period, withdraw anytime
- 🔒 **Fully Tested** - 13 comprehensive tests (Solidity + TypeScript)
- ⚡ **Gas Optimized** - Custom errors and efficient patterns

## 🎯 How It Works

1. **Deposit ETH** → Stake any amount to start earning
2. **Earn 5% APR** → Rewards calculated automatically: `reward = (balance × 5% × time) / 365 days`
3. **Withdraw Anytime** → Get principal + rewards with no lock-up

**Example:** Stake 10 ETH for 37 days → Earn ~0.05 ETH in rewards!

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/SudeepGowda55/aiPay.git
cd aiPay/hardhat-v3
npm install

# Run tests (13 passing)
npx hardhat test

# Run local demo (simulates 37 days)
npx hardhat run scripts/demo-local.ts
```

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity 0.8.28
- **Framework:** Hardhat 3.0.9 (ESM)
- **Testing:** Foundry + Node.js test runner
- **Network:** Sepolia Testnet

---

