import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";

describe("anchor-vault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVault as Program<AnchorVault>;
  const user = provider.wallet.publicKey;

  let vaultStatePDA: PublicKey;
  let vaultPDA: PublicKey;

  before(async () => {
    [vaultStatePDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.toBuffer()],
      program.programId
    );

    [vaultPDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultStatePDA.toBuffer()],
      program.programId
    );

    // const connection = provider.connection;

    // const rentExemptBalance = await provider.connection.getMinimumBalanceForRentExemption(
    //   8 + 1 + 1 
    // );

    // const userBalance = await provider.connection.getBalance(user);
    // if (userBalance < rentExemptBalance) {
    //   try {
    //     const txhash = await connection.requestAirdrop(user, 2 * LAMPORTS_PER_SOL);
    //     connection.confirmTransaction(txhash)
    //     console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    //   } catch(e) {
    //     console.error(`Oops, something went wrong: ${e}`)
    //   }
    // }

    // try {
    //   const txhash = await connection.requestAirdrop(vaultPDA, 2 * LAMPORTS_PER_SOL);
    //   connection.confirmTransaction(txhash)
    //   console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    // } catch(e) {
    //   console.error(`Oops, something went wrong: ${e}`)
    // }
  });

  it("Initialize vault", async () => {
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        user: user,
        vaultState: vaultStatePDA,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("User:", user);
    console.log("Initialized vault with transaction:", tx);
  });

  it("Deposit funds into vault", async () => {
    try {
      const depositAmount = new anchor.BN(1_000_000_000);

      const tx = await program.methods
        .deposit(depositAmount)
        .accountsStrict({
          user: user,
          vaultState: vaultStatePDA,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
  
      console.log("Deposit funds with transaction:", tx);
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error.logs) {
        console.error("Logs:", error.logs);
      }
    }
  });

  it("Withdraw funds from vault", async () => {
    try {
      const withdrawAmount = new anchor.BN(300_000_000);

      const tx = await program.methods
        .withdraw(withdrawAmount)
        .accountsStrict({
          user: user,
          vaultState: vaultStatePDA,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
  
      console.log("Withdrew funds with transaction:", tx);
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error.logs) {
        console.error("Logs:", error.logs);
      }
    }
  });

  it("Close the vault", async () => {
    const tx = await program.methods
      .close()
      .accountsStrict({
        user: user,
        vaultState: vaultStatePDA,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Closed the vault with transaction:", tx);
  });
});
