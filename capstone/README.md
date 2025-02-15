# Farmlink - Capstone Project

**Connecting Small Farmers to Consumers through Blockchain Technology**

## Overview

FarmLink is a decentralized platform designed to empower small-scale farmers by providing them with technological support to tokenize their agricultural products. This tokenization facilitates pre-sales, secures funding, and opens new market opportunities. Consumers benefit by gaining direct access to farm-fresh products, ensuring transparency and trust in the supply chain.

## Problem Statement

In Brazil, government-managed fairs offer spaces for farmers to sell their products. However, these initiatives lack technological support, limiting farmers' ability to optimize sales and reach a broader consumer base.

## Solution

FarmLink addresses this gap by enabling farmers to mint tokens representing their agricultural products. These tokens are held in escrow and transferred to consumers upon purchase. At the point of sale, consumers can prove ownership through these tokens. Once the product is delivered, the token is burned, and the payment is released from escrow to the farmer's wallet.

## User Stories

### Farmer User Stories 🚜

**User Story ID: F-1**

- **User Persona:**
  - **Name:** John
  - **Role:** Farmer
  - **Goal:** Register my farm and sustainable practices on the platform to access funding and new markets through tokenization.

- **User Story:**
  - As a **Farmer (John)**, I want to **register my farm and agricultural practices** so that **I can tokenize my production and access new funding and market opportunities**.

- **Acceptance Criteria:**
  - **Functionality:** Platform should allow farmers to create profiles with farm details, practices, and certifications.
  - **NFT Attributes:** NFTs should represent farm production units with metadata about the practices and crop type.
  - **User Interaction:** Farmers can update and manage their profiles and associated tokenized assets.
  - **Security:** Farmer data should be securely stored, and profiles must be verified.

- **Priority:** High

**User Story ID: F-2**

- **User Persona:**
  - **Name:** Jeff
  - **Role:** Farmer
  - **Goal:** Tokenize future crop batches for pre-sales to consumers.

- **User Story:**
  - As a **Farmer (Jeff)**, I want to **create tokens representing batches of my future crops** so that **I can sell them in advance to secure funding**.

- **Acceptance Criteria:**
  - **Functionality:** Farmers can mint tokens for crop batches with metadata detailing crop type and quantity.
  - **NFT Attributes:** Tokens hold future crop data and transaction terms.
  - **User Interaction:** Investors and consumers can browse and purchase crop tokens.
  - **Security:** Transactions are secured on the blockchain, and smart contracts enforce pre-sale conditions.

- **Priority:** High

**User Story ID: F-4**

- **User Persona:**
  - **Name:** Pedro
  - **Role:** Farmer
  - **Goal:** Log sustainable practices for certification and rewards.

- **User Story:**
  - As a **Farmer (Pedro)**, I want to **log my sustainable practices (e.g., water use, fertilizers)** so that **I can earn certifications and additional rewards for meeting sustainability criteria**.

- **Acceptance Criteria:**
  - **Functionality:** Platform allows farmers to log and track sustainable practices with required metrics.
  - **NFT Attributes:** Sustainable practices recorded are linked to tokens.
  - **User Interaction:** Farmers receive rewards based on certification and practice adherence.
  - **Security:** Data is immutable on the blockchain, ensuring accurate certification records.

- **Priority:** Medium

### Consumer User Stories 🍽️

**User Story ID: C-1**

- **User Persona:**
  - **Name:** Alice
  - **Role:** Consumer
  - **Goal:** Create an account and browse available agricultural products.

- **User Story:**
  - As a **Consumer (Alice)**, I want to **create an account to explore available agricultural products** so that **I can purchase directly from farmers**.

- **Acceptance Criteria:**
  - **Functionality:** Platform enables account creation and browsing through available tokens for future products.
  - **NFT Attributes:** Each token displays product details (origin, practices, crop type).
  - **User Interaction:** Consumers can filter and view tokens based on preferences.
  - **Security:** Account and browsing activity data must be securely stored.

- **Priority:** High

### System Administration User Stories 💼

**User Story ID: A-1**

- **User Persona:**
  - **Name:** Admin Alex
  - **Role:** System Administrator
  - **Goal:** Approve new farmers for platform participation.

- **User Story:**
  - As a **System Administrator (Admin Alex)**, I want to **review and approve new farmer registrations** so that **only verified producers join the platform**.

- **Acceptance Criteria:**
  - **Functionality:** Admin dashboard displays pending farmer registrations.
  - **NFT Attributes:** New profiles require verification and approval for token creation.
  - **User Interaction:** Admins can review details and approve or reject applications.
  - **Security:** Approval process must be secure to prevent unauthorized access.

- **Priority:** High

## Technology Stack

- **Frontend:** Next.js
- **Backend:** Rust with Axum framework
- **Blockchain Program:** Rust with Anchor framework

## Anchor Program Instructions

The Anchor program defines the core instructions for the FarmLink platform:

1. **Initialize FarmLink**

   - **Purpose:** Set up the FarmLink platform with a name and fee structure.
   - **Parameters:**
     - `name` (String): The name of the platform.
     - `fee` (u16): The fee percentage for transactions.
   - **Function Signature:**
     ```rust
     pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()>
     ```

2. **Create Product**

   - **Purpose:** Allow farmers to create a token representing a product batch.
   - **Parameters:**
     - `price` (u64): The price of the product batch.
     - `token_name` (String): The name of the token.
     - `token_symbol` (String): The symbol of the token.
     - `token_uri` (String): The URI containing metadata about the token.
   - **Function Signature:**
     ```rust
     pub fn create_product(
         ctx: Context<CreateProduct>,
         price: u64,
         token_name: String,
         token_symbol: String,
         token_uri: String,
     ) -> Result<()>
     ```

3. **Purchase Product**

   - **Purpose:** Facilitate the purchase of a product by a consumer.
   - **Function Signature:**
     ```rust
     pub fn purchase_product(ctx: Context<Purchase>) -> Result<()>
     ```

4. **Deliver Product**

   - **Purpose:** Confirm the delivery of a product to the consumer.
   - **Function Signature:**
     ```rust
     pub fn deliver_product(ctx: Context<Deliver>) -> Result<()>
     ```

5. **Refund Consumer**

   - **Purpose:** Refund the consumer in case of a failed transaction or non-delivery.
   - **Function Signature:**
     ```rust
     pub fn refund_consumer(ctx: Context<RefundConsumer>) -> Result<()>
     ```

6. **Refund Farmer**

   - ** 

### Deployed Program(Devnet)
[3vJaEJMGZ6yiRtpxgctoxqnsUu73PRUJP5tJAUyCVPRX](https://explorer.solana.com/address/3vJaEJMGZ6yiRtpxgctoxqnsUu73PRUJP5tJAUyCVPRX?cluster=devnet)

### Instructions URL generated by the tests
![Tests on Devnet](assets/images/devnet-tests.png){: style="width: 50%; display: block; margin: 0 auto;"}
- [Setup](https://explorer.solana.com/transaction/3qSGpFhQuj6XDjiF4m51s3ZUeHPhxgVg4id7x6RfWQdAthakzxc9QynaVNnmzCatzcjMYccPRJdfGJHynKNWKL7y?cluster=devnet)
- [Initialize](https://explorer.solana.com/transaction/2dNycQsRRdmqJp6wLzwA6JPui5CCFEAsDtpzcQccG29gxkWc4ubrqVo9A1iMBFRQU2WCa55YPMN1v8r45L7csLuU?cluster=devnet)
- [Create Product](https://explorer.solana.com/transaction/4xENRvPrcqiVLin5S6gXooXqbT1AQs7csbY99c7cWKrBrR5P2agG71kDU4mBck48bfgyVXf16keN2hA4up1ms8fZ?cluster=devnet)
- [Purchase Product](https://explorer.solana.com/transaction/4xENRvPrcqiVLin5S6gXooXqbT1AQs7csbY99c7cWKrBrR5P2agG71kDU4mBck48bfgyVXf16keN2hA4up1ms8fZ?cluster=devnet)
- [Deliver Product](https://explorer.solana.com/transaction/4xENRvPrcqiVLin5S6gXooXqbT1AQs7csbY99c7cWKrBrR5P2agG71kDU4mBck48bfgyVXf16keN2hA4up1ms8fZ?cluster=devnet)

### How to Run the Tests (Localnet)

Uncomment the following code block to generate new keypairs for testing in localnet:

```javascript
//////////////// Commented because in Devnet the airdrop limit can be reached (Uncomment if testing in localnet and comment the 3 loadKeyPairs accounts in lines 101, 102 and 103) ///////////////
// let farmer = Keypair.generate();
// let consumer = Keypair.generate();
// let payer = Keypair.generate();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
```

Comment the following code block to use pre-loaded keypairs for testing in localnet:

```javascript
const farmer = loadKeypair("./keypair-farmer.json");
const consumer = loadKeypair("./keypair-consumer.json");
const payer = loadKeypair("./keypair-payer.json");
```

Uncomment the following code block to request airdrops for the keypairs in localnet:

```javascript
//////////////// Commented because in Devnet the airdrop limit can be reached (Uncomment if testing in localnet) ///////////////
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     farmer.publicKey,
//     0.1 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     consumer.publicKey,
//     0.1 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     payer.publicKey,
//     0.2 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
```

To run the tests in localnet, follow these steps:

1. Open a terminal.
2. Change the directory to `capstone/solana`.
3. Run the following command to start the Solana test validator and deploy the metaplex token metadata program:

```bash
solana-test-validator --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/metaplex_token_metadata_program.so
```

4. Open another terminal.
5. Change the directory to `capstone/solana`.
6. Run the following command to run the tests using the Anchor framework(using the local validator running in the other terminal):

```bash
anchor test --skip-local-validator
```

### How to Run the Tests (Devnet)

Comment the following code block to generate new keypairs for testing in devnet:

```javascript
//////////////// Commented because in Devnet the airdrop limit can be reached (Uncomment if testing in localnet and comment the 3 loadKeyPairs accounts in lines 101, 102 and 103) ///////////////
// let farmer = Keypair.generate();
// let consumer = Keypair.generate();
// let payer = Keypair.generate();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
```

Uncomment the following code block to use pre-loaded keypairs for testing in devnet:

```javascript
const farmer = loadKeypair("./keypair-farmer.json");
const consumer = loadKeypair("./keypair-consumer.json");
const payer = loadKeypair("./keypair-payer.json");
```

Comment the following code block to skip requesting airdrops for the keypairs in devnet:

```javascript
//////////////// Commented because in Devnet the airdrop limit can be reached (Uncomment if testing in localnet) ///////////////
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     farmer.publicKey,
//     0.1 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     consumer.publicKey,
//     0.1 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
// await connection.confirmTransaction(
//   await connection.requestAirdrop(
//     payer.publicKey,
//     0.2 * LAMPORTS_PER_SOL
//   ),
//   "confirmed"
// );
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
```

The comment and uncomment sections are necessary to provide accounts with sufficient balance for testing purposes. This eliminates the need for airdrops and reduces the risk of reaching the airdrop limit.

To run the tests in devnet, follow these steps:

1. Change the directory to `capstone/solana`.
2. Run the following command to run the tests using the Anchor framework with the devnet cluster:

```bash
anchor test --provider.cluster devnet
```

