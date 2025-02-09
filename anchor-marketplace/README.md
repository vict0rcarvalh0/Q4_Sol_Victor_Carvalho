# Anchor Marketplace Program

## 📌 Project Overview
This project is an **Anchor Marketplace Program** built on **Solana** using the **Anchor Framework**. It allows users to list, buy, and delist NFTs in a decentralized marketplace, ensuring secure and transparent transactions via a Solana smart contract.

## 🚀 Features
1. **Initialize Marketplace**: Admin can create a marketplace with a fee structure.
2. **List NFT**: Users can list their NFTs for sale with a specified price.
3. **Purchase NFT**: Buyers can purchase NFTs from the marketplace.
4. **Delist NFT**: Sellers can remove their NFTs from the marketplace before they are sold.

## 📝 Code Overview

### Instructions
The program provides the following instructions:
- **initialize** - Creates the marketplace state and sets up the fee structure.
- **list** - Creates a listing, transfers the NFT to the vault, and stores listing details.
- **purchase** - Transfers SOL from the buyer to the seller, transfers the NFT to the buyer, and closes the listing.
- **delist** - Allows the seller to withdraw their NFT before it is sold.

### States
The program maintains the following accounts:

#### Listing
```rust
#[account]
#[derive(InitSpace)]
pub struct Listing<'info> {
    pub maker: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub bump: u8
}
```
Stores the NFT listing details, including the seller (maker), the NFT mint address, and the price.

#### Marketplace
```rust
#[account]
pub struct Marketplace {
    pub admin: Pubkey,
    pub fee: u16,
    pub bump: u8,
    pub treasury_bump: u8, // Stores accumulated fees
    pub reward_bump: u8, // Stores reward tokens
    pub name: String // Marketplace name
}
```
Stores the marketplace metadata, including admin, fee structure, and reward mechanisms.

## 🛠 Prerequisites
Before running this project, make sure you have the following installed:

1. [Install Rust](https://www.rust-lang.org/tools/install)
2. [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
3. [Install Anchor Framework](https://github.com/coral-xyz/anchor)

## ⚙️ Installation Guide

### Clone the Repository
```sh
git clone https://github.com/your-repo/anchor-marketplace.git
cd anchor-marketplace
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
📦 anchor-marketplace
 ┣ 📂 programs
 ┃ ┗ 📂 anchor_marketplace
 ┃   ┣ 📂 instructions    # Folder that contains the instruction files
 ┃   ┣ 📂 state           # Folder that contains the state files
 ┃   ┣ 📜 Cargo.toml      # Rust dependencies
 ┃   ┣ 📜 lib.rs         # Main smart contract logic
 ┣ 📂 tests
 ┃ ┗ 📜 anchor_marketplace.ts  # Test cases in TypeScript
 ┣ 📜 Anchor.toml       # Anchor configuration
 ┣ 📜 package.json      # Node.js dependencies
 ┗ 📜 README.md         # Project documentation
```

