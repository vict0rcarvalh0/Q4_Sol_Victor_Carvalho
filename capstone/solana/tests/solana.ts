import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

import { Solana } from "../target/types/solana";

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

    expect(farmlinkAccount.farmer.toBase58()).to.equal(farmer.publicKey.toBase58());
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
