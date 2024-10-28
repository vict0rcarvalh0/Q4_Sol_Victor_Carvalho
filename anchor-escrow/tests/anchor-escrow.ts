import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorEscrow } from "../target/types/anchor_escrow";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("anchor-escrow", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorEscrow as Program<AnchorEscrow>;

  let maker: anchor.web3.Keypair;
  let mintA: PublicKey;
  let mintB: PublicKey;
  let makerAtaA: PublicKey;
  let vault: PublicKey;
  let escrow: PublicKey;
  const seed = new anchor.BN(123);

  before(async () => {
    maker = anchor.web3.Keypair.generate();

    await provider.connection.requestAirdrop(maker.publicKey, 2 * LAMPORTS_PER_SOL);

    mintA = await createMint(
      provider.connection,
      maker,
      maker.publicKey,
      null,
      6 
    );

    mintB = await createMint(
      provider.connection,
      maker,
      maker.publicKey,
      null,
      6
    );

    makerAtaA = await createAssociatedTokenAccount(
      provider.connection,
      maker,
      mintA,
      maker.publicKey
    );

    await mintTo(
      provider.connection,
      maker,
      mintA,
      makerAtaA,
      maker,
      1000 * 10 ** 6 
    );

    [vault] = await PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("vault"), maker.publicKey.toBuffer(), seed.toBuffer()],
      program.programId
    );

    [escrow] = await PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("escrow"), maker.publicKey.toBuffer(), seed.toBuffer()],
      program.programId
    );
  });

  it("should initialize escrow and deposit funds", async () => {
    try {
      const depositAmount = new anchor.BN(500 * 10 ** 6);
      const receiveAmount = new anchor.BN(300 * 10 ** 6);

      await program.methods
        .make(seed, depositAmount, receiveAmount)
        .accountsStrict({
          maker: maker.publicKey,
          mintA,
          mintB,
          makerAtaA,
          escrow,
          vault,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([maker])
        .rpc();

      const escrowAccount = await program.account.escrow.fetch(escrow);
      console.log("Escrow Account: ", escrowAccount);

      const vaultAccount = await provider.connection.getTokenAccountBalance(vault);
      console.log("Vault Balance: ", vaultAccount.value.amount);

      assert.strictEqual(vaultAccount.value.amount, depositAmount.toString());
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error.logs) {
        console.error("Logs:", error.logs);
      }
    }
  });
});
