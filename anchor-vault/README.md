# Anchor Vault Program

## 📌 Project Overview
This project is an **Anchor Vault Program** built on **Solana** using the **Anchor Framework**. It allows users to securely deposit and withdraw SOL into a vault, ensuring safe fund management via a Solana smart contract.

## 🚀 Features
1. **Initialize Vault**: Users can create a vault account.
2. **Deposit SOL**: Users can deposit SOL into the vault.
3. **Withdraw SOL**: Users can withdraw SOL from the vault.
4. **Close Vault**: Users can close the vault and reclaim all remaining SOL.

## 📝 Code Overview

### Instructions
The program provides the following instructions:
- initialize - Creates the vault state and vault account.
- deposit - Transfers SOL from the user to the vault.
- withdraw - Transfers SOL from the vault back to the user.
- close - Closes the vault and transfers any remaining SOL to the user.

### States
The program maintains the following accounts:
- VaultState: Stores metadata related to the vault, including the necessary PDA bumps for signature verification.

## 🛠 Prerequisites
Before running this project, make sure you have the following installed:

1. [Install Rust](https://www.rust-lang.org/tools/install) 
2. [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
3. [Install Anchor Framework](https://github.com/coral-xyz/anchor)

## ⚙️ Installation Guide

### Clone the Repository
```sh
git clone https://github.com/vict0rcarvalh0/Q4_Sol_Victor_Carvalho.git
cd Q4_Sol_Victor_Carvalho/anchor-vault
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

📦 anchor-vault
 ┣ 📂 programs
 ┃ ┗ 📂 anchor_vault
 ┃   ┣ 📂 context    # Folder that contains the instruction files
 ┃   ┣ 📂 state           # Folder that contains the state files
 ┃   ┣ 📜 Cargo.toml      # Rust dependencies
 ┃   ┣ 📜 lib.rs         # Main smart contract logic
 ┣ 📂 tests
 ┃ ┗ 📜 anchor_vault.ts  # Test cases in TypeScript
 ┣ 📜 Anchor.toml       # Anchor configuration
 ┣ 📜 package.json      # Node.js dependencies
 ┗ 📜 README.md         # Project documentation
