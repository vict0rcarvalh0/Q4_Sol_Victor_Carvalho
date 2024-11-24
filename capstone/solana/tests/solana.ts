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
  createApproveInstruction,
} from "@solana/spl-token";

import { Solana } from "../target/types/solana";

describe("FarmLink", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

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
  let farmer = Keypair.generate();
  let consumer = Keypair.generate();
  let payer = Keypair.generate();

  let farmerMint: PublicKey;
  let farmerAta: any;

  let consumerMint: PublicKey;
  let consumerAta: any;

  let productMint: PublicKey;

  let vaultAta: any;

  let farmLink: PublicKey;
  let product: PublicKey;
  let treasury: PublicKey;
  let rewardsMint: PublicKey;

  let accountsPublicKeys = {};

  it("setup", async () => {
    try {
      await connection.confirmTransaction(
        await connection.requestAirdrop(
          farmer.publicKey,
          10 * LAMPORTS_PER_SOL
        ),
        "confirmed"
      );
      await connection.confirmTransaction(
        await connection.requestAirdrop(
          consumer.publicKey,
          10 * LAMPORTS_PER_SOL
        ),
        "confirmed"
      );
      await connection.confirmTransaction(
        await connection.requestAirdrop(
          payer.publicKey,
          100_000 * LAMPORTS_PER_SOL
        ),
        "confirmed"
      );

      console.log(
        "Balances:\nfarmer: ",
        (await connection.getBalance(farmer.publicKey)) / LAMPORTS_PER_SOL,
        " \nconsumer: ",
        (await connection.getBalance(consumer.publicKey)) / LAMPORTS_PER_SOL,
        "\npayer: ",
        (await connection.getBalance(payer.publicKey)) / LAMPORTS_PER_SOL
      );

      farmerMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );
      console.log("farmerMint: ", farmerMint);

      farmerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        farmerMint,
        farmer.publicKey
      );
      console.log("farmerAta: ", farmerAta);

      await mintTo(
        connection,
        payer,
        farmerMint,
        farmerAta.address,
        farmer.publicKey,
        1000000000,
        [farmer]
      );
      console.log(
        "mint 1000000000 to farmerAta\tbalance: ",
        await connection.getTokenAccountBalance(farmerAta.address)
      );

      consumerMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );
      console.log("consumerMint: ", consumerMint);

      consumerAta = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        farmerMint,
        consumer.publicKey
      );
      console.log("consumerAta: ", consumerAta);

      await mintTo(
        connection,
        payer,
        farmerMint, // mint
        consumerAta.address, // destination
        farmer.publicKey, // authority
        1000000000,
        [farmer]
      );
      console.log(
        "mint 1000000000 to consumerAta\tbalance: ",
        await connection.getTokenAccountBalance(consumerAta.address)
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
      console.log("product: ", product);

      productMint = await createMint(
        connection,
        payer,
        farmer.publicKey,
        null,
        6
      );
      console.log("productMint: ", productMint);

      treasury = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury", "utf-8"), farmLink.toBuffer()],
        program.programId
      )[0];
      console.log("treasury: ", treasury);

      rewardsMint = PublicKey.findProgramAddressSync(
        [Buffer.from("rewards", "utf-8"), farmLink.toBuffer()],
        program.programId
      )[0];

      vaultAta = await getAssociatedTokenAddress(
        farmerMint,
        product,
        true // allowOwnerOffCurve
      );

      accountsPublicKeys = {
        farmer: farmer.publicKey,
        consumer: consumer.publicKey,
        farmer_mint: farmerMint,
        consumer_mint: consumerMint,
        farmer_ata: farmerAta.address,
        consumer_ata: consumerAta.address,
        product: product,
        vault: vaultAta,
        farmlink: farmLink,
        treasury: treasury,
        system_program: SystemProgram.programId,
        token_program: TOKEN_PROGRAM_ID,
        associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
        rewards_mint: rewardsMint,
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
    const accounts = {
      farmer: accountsPublicKeys["farmer"],
      farmlink: accountsPublicKeys["farmlink"],
      farmerMint: accountsPublicKeys["farmer_mint"],
      product: accountsPublicKeys["product"],
      farmerAta: accountsPublicKeys["farmer_ata"],
      vault: accountsPublicKeys["vault"],
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
    };

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

    try {
        // First approve the transfer
        const approveIx = createApproveInstruction(
            accountsPublicKeys["consumer_ata"],    // source
            accountsPublicKeys["vault"],           // delegate 
            accountsPublicKeys["consumer"],        // owner
            1                                      // amount
        );

        await program.methods
            .deliverProduct()
            .accounts({ ...accounts })
            .signers([consumer, farmer])
            .preInstructions([approveIx])
            .rpc()
            .then(confirm)
            .then(log);
    } catch (error) {
        if (error instanceof SendTransactionError) {
            await error.getLogs(provider.connection);
        }
        console.log(error);
        throw error;
    }
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
      rewardsMint: accountsPublicKeys["rewards_mint"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      treasury: accountsPublicKeys["treasury"],
      vault: accountsPublicKeys["vault"],
    };

    try {
      await program.methods
        .purchaseProduct()
        .accounts({ ...accounts })
        .signers([consumer])
        .rpc()
        .then(confirm)
        .then(log);
    } catch (error) {
      if (error instanceof SendTransactionError) {
        await error.getLogs(provider.connection);
      }
      console.log(error);
      throw error;
    }
  });
});
