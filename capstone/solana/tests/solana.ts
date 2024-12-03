import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SendTransactionError,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import fs from "fs";
import { Solana } from "../target/types/solana";

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const loadKeypair = (filePath: string): Keypair => {
  const secretKey = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
};

describe("FarmLink", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const connection = provider.connection;
  const program = anchor.workspace.Solana as Program<Solana>;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    if (connection.rpcEndpoint === "https://api.devnet.solana.com") {
      console.log(
        `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=devnet`
      );
    } else {
      console.log(
        `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
      );
    }

    return signature;
  };

  const transferMinimumRent = async (account: PublicKey) => {
    const balance = await connection.getBalance(account);
    const minRent = await connection.getMinimumBalanceForRentExemption(165);
    const buffer = 1000;

    if (balance < minRent + buffer) {
      const lamportsToTransfer = minRent + buffer - balance;

      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          anchor.web3.SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: account,
            lamports: lamportsToTransfer,
          })
        ),
        [payer]
      );
    }
  };

  const farmName = "smallfarm";
  const metadata = {
    name: "Fresh Strawberries",
    symbol: "STRW",
    uri: "https://red-chilly-carp-862.mypinata.cloud/ipfs/QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb",
  };

  // Accounts

  /////////////// Commented because in Devnet the airdrop limit can be reached(Uncomment if testing in localnet and comment the 3 loadKeyPairs accounts in lines 101, 102 and 103) ///////////////
  // let farmer = Keypair.generate();
  // let consumer = Keypair.generate();
  // let payer = Keypair.generate();
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const farmer = loadKeypair("./keypair-farmer.json");
  const consumer = loadKeypair("./keypair-consumer.json");
  const payer = loadKeypair("./keypair-payer.json");

  let farmerMint: PublicKey;
  let farmerAta: any;

  let consumerMint: PublicKey;
  let consumerAta: any;

  let productMint: PublicKey;

  let splVault: PublicKey;
  let solVault: PublicKey;

  let farmLink: PublicKey;
  let product: PublicKey;
  let treasury: PublicKey;
  let rewardsMint: PublicKey;
  let metadataAccount: PublicKey;

  let accountsPublicKeys = {};

  it("setup", async () => {
    try {
      /////////////// Commented because in Devnet the airdrop limit can be reached(Uncomment if testing in localnet) ///////////////
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

      farmerMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );

      farmerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        farmerMint,
        farmer.publicKey
      );

      await mintTo(
        connection,
        payer,
        farmerMint,
        farmerAta.address,
        farmer.publicKey,
        1000000000,
        [farmer]
      );

      consumerMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );

      consumerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        farmerMint,
        consumer.publicKey
      );

      await mintTo(
        connection,
        payer,
        farmerMint, // mint
        consumerAta.address, // destination
        farmer.publicKey, // authority
        1000000000,
        [farmer]
      );

      farmLink = PublicKey.findProgramAddressSync(
        [Buffer.from("farmlink", "utf-8"), Buffer.from(farmName, "utf-8")],
        program.programId
      )[0];
      console.log("farmLink: ", farmLink);

      product = PublicKey.findProgramAddressSync(
        [farmLink.toBuffer(), farmerMint.toBuffer()],
        program.programId
      )[0];

      productMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );

      treasury = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury", "utf-8"), farmLink.toBuffer()],
        program.programId
      )[0];

      rewardsMint = PublicKey.findProgramAddressSync(
        [Buffer.from("rewards", "utf-8"), farmLink.toBuffer()],
        program.programId
      )[0];

      splVault = await getAssociatedTokenAddress(
        farmerMint,
        product,
        true // allowOwnerOffCurve
      );

      solVault = PublicKey.findProgramAddressSync(
        [Buffer.from("sol_vault"), farmLink.toBuffer()],
        program.programId
      )[0];

      metadataAccount = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          farmerMint.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      )[0];

      accountsPublicKeys = {
        farmer: farmer.publicKey,
        consumer: consumer.publicKey,
        farmer_mint: farmerMint,
        consumer_mint: consumerMint,
        farmer_ata: farmerAta.address,
        consumer_ata: consumerAta.address,
        product: product,
        spl_vault: splVault,
        sol_vault: solVault,
        farmlink: farmLink,
        treasury: treasury,
        metadata_account: metadataAccount,
        rewards_mint: rewardsMint,
        system_program: SystemProgram.programId,
        token_program: TOKEN_PROGRAM_ID,
        associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        metadata_program_id: METADATA_PROGRAM_ID,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it("initialize", async () => {
    const accounts = {
      farmer: accountsPublicKeys["farmer"],
      farmlink: accountsPublicKeys["farmlink"],
      rewardsMint: accountsPublicKeys["rewards_mint"],
      solVault: accountsPublicKeys["sol_vault"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
    };

    try {
      // Check if the farmlink PDA is already initialized
      const farmlinkAccountInfo = await connection.getAccountInfo(
        accounts.farmlink
      );

      if (farmlinkAccountInfo) {
        console.log(
          "Farmlink PDA already initialized:",
          accounts.farmlink.toBase58()
        );
      } else {
        console.log("Initializing Farmlink PDA...");
        await program.methods
          .initialize(farmName, 1)
          .accounts(accounts)
          .signers([farmer])
          .rpc()
          .then(confirm)
          .then(log);
      }
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(provider.connection);
        console.log("Transaction Logs:", logs);
      }
      console.error("Error initializing farmlink:", error);
      throw error;
    }
  });

  it("create_product", async () => {
    const accounts = {
      farmer: accountsPublicKeys["farmer"],
      farmlink: accountsPublicKeys["farmlink"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      product: accountsPublicKeys["product"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      splVault: accountsPublicKeys["spl_vault"],
      solVault: accountsPublicKeys["sol_vault"],
      metadataAccount: accountsPublicKeys["metadata_account"],
      rent: accountsPublicKeys["rent"],
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      metadataProgram: METADATA_PROGRAM_ID,
    };

    await program.methods
      .createProduct(
        new BN(0.01 * LAMPORTS_PER_SOL),
        metadata.name,
        metadata.symbol,
        metadata.uri
      )
      .accounts({ ...accounts })
      .signers([farmer])
      .rpc()
      .then(confirm)
      .then(log)
      .catch(async (error) => {
        if (error instanceof SendTransactionError) {
          await error.getLogs(provider.connection);
        }
        console.log(error);
        throw error;
      });
  });

  it("purchase_product", async () => {
    const accounts = {
      consumer: accountsPublicKeys["consumer"],
      farmer: accountsPublicKeys["farmer"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      farmlink: accountsPublicKeys["farmlink"],
      consumerAta: accountsPublicKeys["consumer_ata"],
      splVault: accountsPublicKeys["spl_vault"],
      solVault: accountsPublicKeys["sol_vault"],
      rewardsMint: accountsPublicKeys["rewards_mint"],
      product: accountsPublicKeys["product"],
      treasury: accountsPublicKeys["treasury"],
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
    };

    // Fund all relevant accounts that need rent
    const accountsToFund = [
      accounts.consumer,
      accounts.consumerAta,
      accounts.splVault,
      accounts.solVault,
      accounts.treasury,
    ];

    for (const account of accountsToFund) {
      await transferMinimumRent(account);
    }

    try {
      await program.methods
        .purchaseProduct()
        .accounts(accounts)
        .signers([consumer])
        .rpc()
        .then(confirm)
        .then(log);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(provider.connection);
        console.log("Transaction Logs:", logs);
      }
      throw error;
    }
  });

  it("deliver_product", async () => {
    const accounts = {
      consumer: accountsPublicKeys["consumer"],
      consumerAta: accountsPublicKeys["consumer_ata"],
      farmer: accountsPublicKeys["farmer"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      farmlink: accountsPublicKeys["farmlink"],
      product: accountsPublicKeys["product"],
      solVault: accountsPublicKeys["sol_vault"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
    };

    try {
      await program.methods
        .deliverProduct()
        .accounts(accounts)
        .signers([consumer, farmer])
        .rpc()
        .then(confirm)
        .then(log);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(provider.connection);
        console.log("Transaction Logs:", logs);
      }
      console.log(error);
      throw error;
    }
  });
});
