import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  SendTransactionError,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

import { Solana } from "../target/types/solana";
import { expect } from "chai";

describe("Initialize", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solana as Program<Solana>;

  // Accounts
  const farmer = provider.wallet;
  const name = "MyFarm";
  const fee = 500;

  let farmlinkPda: PublicKey;
  let farmlinkBump: number;
  let treasuryPda: PublicKey;
  let treasuryBump: number;
  let rewardsMintPda: PublicKey;
  let rewardsMintBump: number;

  // Derive the PDAs for the program accounts
  before(async () => {
    [farmlinkPda, farmlinkBump] = await PublicKey.findProgramAddress(
      [Buffer.from("farmlink"), Buffer.from(name)],
      program.programId
    );

    [treasuryPda, treasuryBump] = await PublicKey.findProgramAddress(
      [Buffer.from("treasury"), farmlinkPda.toBuffer()],
      program.programId
    );

    [rewardsMintPda, rewardsMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from("rewards"), farmlinkPda.toBuffer()],
      program.programId
    );
  });

  it("Initializes a FarmLink successfully", async () => {
    await program.methods
      .initialize(name, fee)
      .accounts({
        farmer: farmer.publicKey,
        farmlink: farmlinkPda,
        treasury: treasuryPda,
        rewardsMint: rewardsMintPda,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([])
      .rpc();

    const farmlinkAccount = await program.account.farmLink.fetch(farmlinkPda);

    expect(farmlinkAccount.farmer.toBase58()).to.equal(
      farmer.publicKey.toBase58()
    );
    expect(farmlinkAccount.name).to.equal(name);
    expect(farmlinkAccount.fee).to.equal(fee);
    expect(farmlinkAccount.bump).to.equal(farmlinkBump);
    expect(farmlinkAccount.treasuryBump).to.equal(treasuryBump);
    expect(farmlinkAccount.rewardBump).to.equal(rewardsMintBump);
  });

  it("Fails with a name that is too long", async () => {
    const invalidName = "ThisNameIsWayTooLongToBeValidForTheProgram";

    try {
      await program.methods
        .initialize(invalidName, fee)
        .accounts({
          farmer: farmer.publicKey,
          farmlink: farmlinkPda,
          treasury: treasuryPda,
          rewardsMint: rewardsMintPda,
          systemProgram: SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([])
        .rpc();

      throw new Error("The transaction should have failed but did not.");
    } catch (err) {
      expect(err.message).to.contain("Simulation failed.");
    }
  });
});

describe("FarmLink", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;

  const program = anchor.workspace.Solana as Program<Solana>;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const farmName = "smallfarm";

  // Accounts
  const farmer = Keypair.generate();
  const consumer = Keypair.generate();
  const farmer_mint = Keypair.generate();
  const rewards_mint = Keypair.generate();
  // const product = Keypair.generate();

  const farmlink = PublicKey.findProgramAddressSync(
    [Buffer.from("farmlink", "utf-8"), Buffer.from(farmName, "utf-8")],
    program.programId
  )[0];
  const treasury = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury", "utf-8"), farmlink.toBuffer()],
    program.programId
  )[0];
  const product = PublicKey.findProgramAddressSync(
    [farmer.publicKey.toBuffer(), farmer_mint.publicKey.toBuffer()],
    program.programId
  )[0];
  const farmer_ata = getAssociatedTokenAddressSync(
    farmer_mint.publicKey,
    farmer.publicKey
  );
  const consumer_ata = getAssociatedTokenAddressSync(
    farmer_mint.publicKey,
    consumer.publicKey
  );
  const vault = getAssociatedTokenAddressSync(
    farmer_mint.publicKey,
    product,
    true
  );
  const accountsPublicKeys = {
    farmer: farmer.publicKey,
    consumer: consumer.publicKey,
    farmer_mint: farmer_mint.publicKey,
    rewards_mint: rewards_mint.publicKey,
    farmlink,
    treasury,
    product: product,
    farmer_ata,
    consumer_ata,
    vault,
    associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  };

  it("setup", async () => {
    let lamports = await getMinimumBalanceForRentExemptMint(connection);
    let transfer_transactions = new Transaction();
    transfer_transactions.instructions = [
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: farmer.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: consumer.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: farmer_mint.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: rewards_mint.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
    ];

    let tx = new Transaction();
    tx.instructions = [
      createInitializeMint2Instruction(
        farmer_mint.publicKey,
        6,
        farmer.publicKey,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        farmer_ata,
        farmer.publicKey,
        farmer_mint.publicKey
      ),
      createMintToInstruction(
        farmer_mint.publicKey,
        farmer_ata,
        farmer.publicKey,
        1000000000
      ),
      createInitializeMint2Instruction(
        farmer_mint.publicKey,
        6,
        consumer.publicKey,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        consumer_ata,
        consumer.publicKey,
        farmer_mint.publicKey
      ),
      createMintToInstruction(
        farmer_mint.publicKey,
        consumer_ata,
        consumer.publicKey,
        1000000000
      ),
      createInitializeMint2Instruction(
        farmer_mint.publicKey,
        6,
        product,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        vault,
        product,
        farmer_mint.publicKey
      ),
      createMintToInstruction(
        farmer_mint.publicKey,
        vault,
        product,
        1000000000
      ),
    ];

    console.log("accountsPublicKeys", accountsPublicKeys);

    const transfer_signers = [farmer_mint, rewards_mint];
    const signers = [farmer, consumer];

    await provider
      .sendAndConfirm(transfer_transactions, transfer_signers)
      .then(log)
      .catch(async (error) => {
        if (error instanceof SendTransactionError) {
          await error.getLogs(provider.connection);
        }
        console.log(error);
        throw error;
      });

    await provider
      .sendAndConfirm(tx, signers)
      .then(log)
      .catch(async (error) => {
        if (error instanceof SendTransactionError) {
          await error.getLogs(provider.connection);
        }
        console.log(error);
        throw error;
      });
  });

  it("initialize", async () => {
    const accounts = {
      farmer: accountsPublicKeys["farmer"],
      farmlink: accountsPublicKeys["farmlink"],
      rewardsMint: accountsPublicKeys["rewards_mint"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
    };
    await program.methods
      .initialize(farmName, 1)
      .accounts({ ...accounts })
      .signers([farmer])
      .rpc()
      .then(confirm)
      .then(log);
  });

  it("create_product", async () => {
    const farmlinkAccounts = {
      farmer: accountsPublicKeys["farmer"],
      farmlink: accountsPublicKeys["farmlink"],
      rewardsMint: accountsPublicKeys["rewards_mint"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
    };

    const accounts = {
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      farmer: accountsPublicKeys["farmer"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      farmlink: accountsPublicKeys["farmlink"],
      product: accountsPublicKeys["product"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      vault: accountsPublicKeys["vault"],
    };

    await program.methods
      .initialize(farmName, 1)
      .accounts({ ...farmlinkAccounts })
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

    await program.methods
      .createProduct(new BN(1))
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
  it("deliver_product", async () => {
    const accounts = {
      consumer: accountsPublicKeys["consumer"],
      consumerAta: accountsPublicKeys["consumer_ata"],
      farmer: accountsPublicKeys["farmer"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      farmlink: accountsPublicKeys["farmlink"],
      product: accountsPublicKeys["product"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      vault: accountsPublicKeys["vault"],
    };
    await program.methods
      .deliverProduct()
      .accounts({ ...accounts })
      .signers([consumer, farmer])
      .rpc()
      .then(confirm)
      .then(log);
  });
  it("purchase_product", async () => {
    const accounts = {
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      consumer: accountsPublicKeys["consumer"],
      consumerAta: accountsPublicKeys["consumer_ata"],
      farmer: accountsPublicKeys["farmer"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      farmlink: accountsPublicKeys["farmlink"],
      product: accountsPublicKeys["product"],
      rewards: accountsPublicKeys["rewards_mint"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
      vault: accountsPublicKeys["vault"],
    };
    await program.methods
      .purchaseProduct()
      .accounts({ ...accounts })
      .signers([consumer])
      .rpc()
      .then(confirm)
      .then(log);
  });
});
