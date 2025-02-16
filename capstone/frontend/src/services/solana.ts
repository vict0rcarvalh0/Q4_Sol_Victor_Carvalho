import { Program, AnchorProvider, BN, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import idl from "./solana.json";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";


const PROGRAM_ID = new PublicKey("FNkU8cgDKePrpyMeVoxZ8CvEJRHkuXReNq2YpsM48SrL");
const METAPLEX_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, window.solana, { commitment: "confirmed" });
const program = new Program(idl as Idl, PROGRAM_ID, provider);

// ✅ Função para verificar se a conta já existe
async function checkIfAccountExists(publicKey: PublicKey): Promise<boolean> {
  const accountInfo = await connection.getAccountInfo(publicKey);
  return accountInfo !== null;
}

// ✅ Função para encontrar o PDA do `farmlink`
async function getFarmlinkPDA(name: string) {
  return await PublicKey.findProgramAddress(
    [Buffer.from("farmlink"), Buffer.from(name)], // 🔥 Agora usando o nome corretamente!
    PROGRAM_ID
  );
}

// ✅ Inicializa um novo FarmLink (se não existir)
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

// ✅ Criação de um produto vinculado ao `farmlink`
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

  // 🔥 Recuperar o PDA do FarmLink (deve estar inicializado)
  const [farmlink] = await getFarmlinkPDA(name);
  // const exists = await checkIfAccountExists(farmlink);
  // if (!exists) {
  //   throw new Error("Erro: A conta 'farmlink' não está inicializada. Execute 'initialize' primeiro.");
  // }

  // 🔥 Recuperar o PDA do FarmLink
  // const [farmlink] = await PublicKey.findProgramAddress(
  //   [Buffer.from("farmlink"), farmer.toBuffer()],
  //   PROGRAM_ID
  // );

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
    const tx = await program.rpc.initialize(name, 100, {
      accounts: {
        farmer,
        farmlink,
        treasury,
        rewardsMint,
        solVault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    console.log("✅ Farmlink inicializado:", tx);
  } else {
    console.log("⏩ Pulando inicialização, pois a conta já existe.");
  }
  
  
  // 🔥 Gerar PDA do Farmer Mint
  // const [farmerMint] = await PublicKey.findProgramAddress(
  //   [Buffer.from("farmer_mint"), farmlink.toBuffer()],
  //   PROGRAM_ID
  // );
  const farmerMint = await createMint(
    provider.connection, 
    provider.wallet.publicKey, // AQUI ESTA A MERDA
    provider.wallet.publicKey, 
    null, 
    0 
  );

  // 🔥 Gerar PDA do Produto (product)
  const [product] = await PublicKey.findProgramAddress(
    [Buffer.from("product"), farmlink.toBuffer(), Buffer.from(tokenName)],
    PROGRAM_ID
  );

  // 🔥 Gerar PDA do Cofre (Vault)
  const [vaultAccount] = await PublicKey.findProgramAddress(
    [Buffer.from("vault"), product.toBuffer()],
    PROGRAM_ID
  );

  const [splVault] = await PublicKey.findProgramAddress(
    [Buffer.from("sol_vault"), farmlink.toBuffer()], 
    PROGRAM_ID
  );

  // 🔥 Gerar PDA do MetadataAccount
  const [metadataAccount] = await PublicKey.findProgramAddress(
    [Buffer.from("metadata"), product.toBuffer()],
    METAPLEX_PROGRAM_ID // Usando o ID do programa de metadados
  );

  // 🔥 Criar ou recuperar a Associated Token Account (ATA) do agricultor
  const farmerAta = await getAssociatedTokenAddress(
    farmerMint,
    farmer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const tx2 = await program.rpc.createProduct(
    new BN(price), tokenName, tokenSymbol, tokenUri,
    {
      accounts: {
        farmer: farmer, // ✅ Conta do agricultor
        farmlink: farmlink, // ✅ Associado ao agricultor
        farmerMint: farmerMint, // ✅ Mint do agricultor
        product: product, // ✅ Produto
        vaultAccount: vaultAccount, // ✅ Cofre (Vault)
        splVault: splVault,
        solVault: solVault,
        metadataAccount: metadataAccount, // ✅ Conta de metadados
        farmerAta: farmerAta, // ✅ A conta de token associada ao agricultor
        systemProgram: SystemProgram.programId,
        metadataProgram: METAPLEX_PROGRAM_ID, // ✅ Adicionando a conta do programa de metadados
        rent: SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
      },
    }
  );

  console.log("✅ Product created with tx:", tx2);
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