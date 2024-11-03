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
import { AnchorEscrow } from "../target/types/anchor_escrow";

describe("Escrow Program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;

  const program = anchor.workspace.AnchorEscrow as Program<AnchorEscrow>;

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

  // Accounts
  const taker = Keypair.generate();
  const maker = Keypair.generate();
  const mint_a = Keypair.generate();
  const mint_b = Keypair.generate();
  const escrow = PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow", "utf-8"),
      maker.publicKey.toBuffer(),
      new BN(1).toBuffer("le", 8),
    ],
    program.programId
  )[0];
  const vault = getAssociatedTokenAddressSync(mint_a.publicKey, escrow, true);
  const maker_ata_a = getAssociatedTokenAddressSync(
    mint_a.publicKey,
    maker.publicKey
  );
  const accountsPublicKeys = {
    taker: taker.publicKey,
    maker: maker.publicKey,
    mint_a: mint_a.publicKey,
    mint_b: mint_b.publicKey,
    escrow,
    vault,
    maker_ata_a,
    associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,

    tokenProgram: TOKEN_PROGRAM_ID,

    systemProgram: SystemProgram.programId,
  };

  it("setup", async () => {
    let lamports = await getMinimumBalanceForRentExemptMint(connection);
    let tx = new Transaction();
    tx.instructions = [
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: taker.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: maker.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: mint_a.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: mint_b.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mint_a.publicKey,
        2,
        escrow,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        vault,
        escrow,
        mint_a.publicKey
      ),
      createMintToInstruction(
        mint_a.publicKey,
        vault,
        escrow,
        1000000000
      ),
      createInitializeMint2Instruction(
        mint_a.publicKey,
        2,
        maker.publicKey,
        null
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        maker_ata_a,
        maker.publicKey,
        mint_a.publicKey
      ),
      createMintToInstruction(
        mint_a.publicKey,
        maker_ata_a,
        maker.publicKey,
        1000000000
      ),
    ];
    console.log(accountsPublicKeys);
    await provider
      .sendAndConfirm(tx, [mint_a, mint_b, maker])
      .then(log)
      .catch(async (error) => {
        if (error instanceof SendTransactionError) {
          await error.getLogs(provider.connection);
        }
        console.log(error);
        throw error;
      });
  });

  it("make", async () => {
    const accounts = {
      associatedTokenProgram: accountsPublicKeys["associated_token_program"],
      escrow: accountsPublicKeys["escrow"],
      maker: accountsPublicKeys["maker"],
      makerAtaA: accountsPublicKeys["maker_ata_a"],
      mintA: accountsPublicKeys["mint_a"],
      mintB: accountsPublicKeys["mint_b"],
      systemProgram: accountsPublicKeys["system_program"],
      tokenProgram: accountsPublicKeys["token_program"],
      vault: accountsPublicKeys["vault"],
    };
    await program.methods
      .make(new BN(1), new BN(1), new BN(2))
      .accounts({ ...accounts })
      .signers([maker])
      .rpc()
      .then(confirm)
      .then(log);
  });
});
