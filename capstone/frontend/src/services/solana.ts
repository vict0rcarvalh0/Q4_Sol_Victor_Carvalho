import { Program, AnchorProvider, BN, Idl } from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import idl from "./solana.json";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  // createMint,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const PROGRAM_ID = new PublicKey(
  "FNkU8cgDKePrpyMeVoxZ8CvEJRHkuXReNq2YpsM48SrL"
);
const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, window.solana, {
  commitment: "confirmed",
});
const program = new Program(idl as Idl, PROGRAM_ID, provider);

async function checkIfAccountExists(publicKey: PublicKey): Promise<boolean> {
  const accountInfo = await connection.getAccountInfo(publicKey);
  return accountInfo !== null;
}

async function getFarmlinkPDA(name: string) {
  return await PublicKey.findProgramAddress(
    [Buffer.from("farmlink"), Buffer.from(name)],
    PROGRAM_ID
  );
}

async function requestSolAirdrop(connection: Connection, recipient: PublicKey) {
  console.log(`💸 Solicitando airdrop para: ${recipient.toBase58()}...`);

  const airdropSignature = await connection.requestAirdrop(
    recipient,
    1 * LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(airdropSignature, "confirmed");

  console.log("✅ Airdrop concluído!");
}

export async function initializeFarmLink(name: string, fee: number) {
  if (!provider.wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const farmer = provider.wallet.publicKey;
  const [farmlink] = await getFarmlinkPDA(name);

  const exists = await checkIfAccountExists(farmlink);
  if (exists) {
    console.log("✅ A conta 'farmlink' já está inicializada.");
    return;
  }

  console.log("🔄 Inicializando 'farmlink'...");

  const [treasury] = await PublicKey.findProgramAddress(
    [Buffer.from("treasury"), farmlink.toBuffer()],
    PROGRAM_ID
  );

  const [rewardsMint] = await PublicKey.findProgramAddress(
    [Buffer.from("rewards"), farmlink.toBuffer()],
    PROGRAM_ID
  );

  const [solVault] = await PublicKey.findProgramAddress(
    [Buffer.from("sol_vault"), farmlink.toBuffer()],
    PROGRAM_ID
  );

  const tx = await program.rpc.initialize(name, fee, {
    accounts: {
      farmer,
      farmlink,
      treasury,
      rewardsMint,
      solVault,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  });

  console.log("✅ FarmLink inicializado com tx:", tx);
}

export async function createProduct(
  name: string,
  price: number,
  tokenName: string,
  tokenSymbol: string,
  tokenUri: string
) {
  if (!provider.wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const farmer = provider.wallet.publicKey;
  const tx = new Transaction();

  const [farmlink] = await getFarmlinkPDA(name);
  const [treasury] = await PublicKey.findProgramAddress(
    [Buffer.from("treasury"), farmlink.toBuffer()],
    PROGRAM_ID
  );
  const [rewardsMint] = await PublicKey.findProgramAddress(
    [Buffer.from("rewards"), farmlink.toBuffer()],
    PROGRAM_ID
  );
  const [solVault] = await PublicKey.findProgramAddress(
    [Buffer.from("sol_vault"), farmlink.toBuffer()],
    PROGRAM_ID
  );

  const accountInfo = await provider.connection.getAccountInfo(farmlink);
  if (!accountInfo) {
    console.log("🔨 Inicializando Farmlink...");
    tx.add(
      program.instruction.initialize(name, 100, {
        accounts: {
          farmer,
          farmlink,
          treasury,
          rewardsMint,
          solVault,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      })
    );
    console.log("✅ Farmlink inicializado:", tx);
  } else {
    console.log("⏩ Pulando inicialização, pois a conta já existe.");
  }

  const farmerMint = Keypair.generate();
  const mintRent = await provider.connection.getMinimumBalanceForRentExemption(
    MINT_SIZE
  );

  const farmerBalance = await provider.connection.getBalance(farmer);
  if (farmerBalance < mintRent) {
    console.log(`⚠️ Saldo insuficiente (${farmerBalance} lamports). Solicitando airdrop...`);
    await requestSolAirdrop(provider.connection, farmer);
  }

  tx.add(
    SystemProgram.createAccount({
      fromPubkey: farmer,
      newAccountPubkey: farmerMint.publicKey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  tx.add(
    createInitializeMintInstruction(
      farmerMint.publicKey,
      6,
      farmer,
      null
      // TOKEN_PROGRAM_ID
    )
  );

  const farmerAta = await getAssociatedTokenAddress(
    farmerMint.publicKey,
    farmer
  );

  tx.add(
    createAssociatedTokenAccountInstruction(
      farmer,
      farmerAta,
      farmer,
      farmerMint.publicKey
    )
  );

  const [product] = await PublicKey.findProgramAddress(
    [farmlink.toBuffer(), farmerMint.publicKey.toBuffer()],
    PROGRAM_ID
  );
  const [vaultAccount] = await PublicKey.findProgramAddress(
    [Buffer.from("vault"), product.toBuffer()],
    PROGRAM_ID
  );
  const [metadataAccount] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      farmerMint.publicKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  const splVault = await getAssociatedTokenAddress(
    farmerMint.publicKey,
    product,
    true // allowOwnerOffCurve
  );

  tx.add(
    program.instruction.createProduct(
      new BN(price),
      tokenName,
      tokenSymbol,
      tokenUri,
      {
        accounts: {
          farmer,
          farmlink,
          farmerMint: farmerMint.publicKey,
          product, 
          farmerAta,
          splVault, 
          vaultAccount,
          solVault, 
          metadataAccount,
          rent: SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId, 
          tokenProgram: TOKEN_PROGRAM_ID, 
          metadataProgram: METADATA_PROGRAM_ID,
        },
      }
    )
  );
  console.log("🚀 Assinando e enviando a transação...");

  tx.feePayer = farmer;
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;

  tx.partialSign(farmerMint);

  const signedTx = await provider.wallet.signTransaction(tx);
  signedTx.partialSign(farmerMint);

  const txId = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(txId);
  console.log("✅ Produto criado com sucesso! Tx:", txId);
}

export async function purchaseProduct() {
  const tx = await program.rpc.purchaseProduct({
    accounts: {
      consumerAccount: provider.wallet.publicKey,
      productAccount: Keypair.generate().publicKey,
      vaultAccount: Keypair.generate().publicKey,
      treasuryAccount: Keypair.generate().publicKey,
      systemProgram: SystemProgram.programId,
    },
  });
  console.log("Product purchased with tx:", tx);
}

export async function deliverProduct() {
  const tx = await program.rpc.deliverProduct({
    accounts: {
      consumerAccount: provider.wallet.publicKey,
      productAccount: Keypair.generate().publicKey,
      vaultAccount: Keypair.generate().publicKey,
      systemProgram: SystemProgram.programId,
    },
  });
  console.log("Product delivered with tx:", tx);
}
