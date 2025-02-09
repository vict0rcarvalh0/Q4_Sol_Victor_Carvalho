# Anchor Escrow Program

## 📌 Project Overview
This project is an **Escrow Program** built on **Solana** using the **Anchor Framework**. It allows users to create an escrow account where assets (tokens) are securely locked until predefined conditions are met. The smart contract ensures trustless transactions between two parties.

## 🚀 Features
1. **Create Escrow**: A user can initialize an escrow by depositing assets.
2. **Fund Escrow**: The counterparty can deposit assets according to the agreement.
3. **Close Escrow**: The escrow can be closed upon fulfillment of conditions, releasing assets to the respective parties.
4. **Cancel Escrow**: The escrow initiator can cancel and retrieve their assets if conditions are not met.

## 🛠 Prerequisites
Before running this project, make sure you have the following installed:

1. [Install Rust](https://www.rust-lang.org/tools/install) 
2. [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
3. [Install Anchor Framework](https://github.com/coral-xyz/anchor)

## ⚙️ Installation Guide

### Clone the Repository

```sh
git clone https://github.com/vict0rcarvalh0/Q4_Sol_Victor_Carvalho.git
cd Q4_Sol_Victor_Carvalho/anchor-escrow
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
📦 anchor-escrow
 ┣ 📂 programs
 ┃ ┗ 📂 anchor-escrow
 ┃   ┣ 📂 context    # Folder that contains the instruction files
 ┃   ┣ 📂 state           # Folder that contains the state files
 ┃   ┣ 📜 Cargo.toml      # Rust dependencies
 ┃   ┣ 📜 lib.rs         # Main smart contract logic
 ┣ 📂 tests
 ┃ ┗ 📜 anchor-escrow.ts        # Test cases in TypeScript
 ┣ 📜 Anchor.toml       # Anchor configuration
 ┣ 📜 package.json      # Node.js dependencies
 ┗ 📜 README.md         # Project documentation
```