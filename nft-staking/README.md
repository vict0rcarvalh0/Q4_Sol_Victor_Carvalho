# NFT Staking Program

## 📌 Project Overview
This project is a **NFT Staking Program** built on **Solana** using **Anchor Framework**. It allows users to stake their NFTs and earn rewards over time. The smart contract manages the staking, reward distribution, and NFT withdrawal processes.

## 🚀 Features
1. **Stake NFT**: Users can deposit their NFTs into the staking program.
2. **Earn Rewards**: While staked, NFTs generate rewards based on predefined conditions.
3. **Unstake NFT**: Users can withdraw their staked NFTs after the staking period ends.
4. **Claim Rewards**: Users can claim their accumulated staking rewards.

## 🛠 Prerequisites
Before running this project, make sure you have the following installed:

1. [Install Rust](https://www.rust-lang.org/tools/install) 
2. [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
3. [Install Anchor Framework](https://github.com/coral-xyz/anchor)

## ⚙️ Installation Guide

### Clone the Repository
```sh
git clone https://github.com/vict0rcarvalh0/Q4_Sol_Victor_Carvalho.git
cd Q4_Sol_Victor_Carvalho/nft-staking
```

### Build and run the tests
```sh
anchor build
anchor test
```

## ▶️ Deploy the program

### Deploy to Devnet

Set the Cluster to Devnet: Configure Solana CLI to use the Devnet cluster:
```bash
solana config set --url https://api.devnet.solana.com
```

Deploy the Program: Use Anchor's deployment command to deploy to Devnet:
```bash
anchor deploy --provider.cluster devnet
```

### Deploy to Local Validator

If you want to test the program in a local environment, you can run a local Solana validator and deploy the program there.

1. Run the Local Validator: In one terminal, start a local Solana validator:
```bash
solana-test-validator
```

2. Set the Cluster to Localhost: In another terminal, configure Solana CLI to use the local validator:
```bash
solana config set --url http://localhost:8899
```

3. Deploy the Program to Local Validator: Skip starting a local validator again by using:
```bash
anchor deploy --skip-local-validator
```

## 📂 Project Structure
```
📦 nft-staking
 ┣ 📂 programs
 ┃ ┗ 📂 nft_staking
 ┃   ┣ 📂 instructions    # Folder that contains the instruction files
 ┃   ┣ 📂 state           # Folder that contains the state files
 ┃   ┣ 📜 Cargo.toml      # Rust dependencies
 ┃   ┣ 📜 lib.rs         # Main smart contract logic
 ┣ 📂 tests
 ┃ ┗ 📜 nft_staking.ts  # Test cases in TypeScript
 ┣ 📜 Anchor.toml       # Anchor configuration
 ┣ 📜 package.json      # Node.js dependencies
 ┗ 📜 README.md         # Project documentation
```
