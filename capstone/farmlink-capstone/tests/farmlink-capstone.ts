import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import { FarmlinkCapstone } from "../target/types/farmlink_capstone";
import { assert } from "chai";

describe("Test Minter", () => {
  const METADATA_SEED = "metadata";
  const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  const MINT_SEED = "mint";

  // Configurando o provedor
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Configurando o programa
  const program = anchor.workspace.FarmlinkCapstone as Program<FarmlinkCapstone>;

  // Dados do teste
  const payer = provider.wallet.publicKey;
  const metadata = {
    name: "Just a Test Token",
    symbol: "TEST",
    uri: "https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI",
    decimals: 9,
  };
  const mintAmount = 10;
  const [mint] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED)],
    program.programId
  );

  const [metadataAddress] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_SEED),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  // Test init token
  it("initialize", async () => {
    const info = await provider.connection.getAccountInfo(mint);
    if (info) {
      return;
    }
    console.log("  Mint not found. Attempting to initialize.");

    const context = {
      metadata: metadataAddress,
      mint,
      payer,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    };

    const tx = await program.methods
      .tokenFactory(metadata)
      .accounts(context)
      .transaction();

    const txHash = await web3.sendAndConfirmTransaction(provider.connection, tx, [provider.wallet.payer], {skipPreflight: true});
    console.log(`  https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    const newInfo = await provider.connection.getAccountInfo(mint);
    assert(newInfo, "  Mint should be initialized.");
  });

  // Test mint tokens
  it("mint tokens", async () => {
    const destination = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: payer,
    });

    let initialBalance: number;
    try {
      const balance = (await provider.connection.getTokenAccountBalance(destination));
      initialBalance = balance.value.uiAmount;
    } catch {
      initialBalance = 0;
    } 
    
    const context = {
      mint,
      destination,
      payer,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
    };

    const tx = await program.methods
      .mintTokens(new BN(mintAmount * 10 ** metadata.decimals))
      .accounts(context)
      .transaction();

    const txHash = await web3.sendAndConfirmTransaction(provider.connection, tx, [provider.wallet.payer], {skipPreflight: true});
    console.log(`  https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

    const postBalance = (
      await provider.connection.getTokenAccountBalance(destination)
    ).value.uiAmount;

    assert.equal(
      initialBalance + mintAmount,
      postBalance,
      "Post balance should equal initial plus mint amount"
    );
  });
});
