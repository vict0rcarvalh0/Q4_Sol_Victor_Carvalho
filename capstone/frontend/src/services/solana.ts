import { BN, Program, AnchorProvider } from "@coral-xyz/anchor";
import {
  Keypair,
  Connection,
  PublicKey,
  SystemProgram,
  SendTransactionError,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export default class SolanaFarmService {
  private program: Program;
  private provider: AnchorProvider;
  private connection: Connection;

  constructor(program: Program, provider: AnchorProvider) {
    this.program = program;
    this.provider = provider;
    this.connection = provider.connection;
  }

  // Airdrop method
  async airdrop(publicKey: PublicKey, amount: number) {
    try {
      const signature = await this.connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await this.connection.confirmTransaction(signature, "confirmed");
      console.log(`Airdropped ${amount} SOL to ${publicKey.toBase58()}`);
    } catch (error) {
      console.error("Airdrop failed:", error);
      throw error;
    }
  }

  // Initialize Farm
  async initializeFarm(farmName: string, rewardRate: number, farmer: Keypair) {
    const accounts = {
      farmer: farmer.publicKey,
      farmlink: await this.findFarmLinkPDA(farmName),
      rewardsMint: await this.createMint(farmer),
      solVault: await this.createVault(farmName, "sol_vault"),
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      treasury: await this.createTreasuryPDA(farmName),
    };

    try {
      await this.program.methods
        .initialize(farmName, rewardRate)
        .accounts(accounts)
        .signers([farmer])
        .rpc();
      console.log("Farm initialized successfully");
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create Product
  async createProduct(
    farmer: Keypair,
    farmName: string,
    productPrice: number,
    metadata: { name: string; symbol: string; uri: string }
  ) {
    const accounts = {
      farmer: farmer.publicKey,
      farmlink: await this.findFarmLinkPDA(farmName),
      farmerMint: await this.createMint(farmer),
      product: await this.findProductPDA(farmName, farmer),
      splVault: await this.createVault(farmName, "spl_vault"),
      metadataAccount: await this.createMetadataAccount(farmer),
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    try {
      await this.program.methods
        .createProduct(new BN(productPrice * LAMPORTS_PER_SOL), metadata.name, metadata.symbol, metadata.uri)
        .accounts(accounts)
        .signers([farmer])
        .rpc();
      console.log("Product created successfully");
    } catch (error) {
      this.handleError(error);
    }
  }

  // Purchase Product
  async purchaseProduct(consumer: Keypair, farmName: string) {
    const accounts = {
      consumer: consumer.publicKey,
      farmlink: await this.findFarmLinkPDA(farmName),
      splVault: await this.createVault(farmName, "spl_vault"),
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    try {
      await this.program.methods
        .purchaseProduct()
        .accounts(accounts)
        .signers([consumer])
        .rpc();
      console.log("Product purchased successfully");
    } catch (error) {
      this.handleError(error);
    }
  }

  // Deliver Product
  async deliverProduct(consumer: Keypair, farmer: Keypair, farmName: string) {
    const accounts = {
      consumer: consumer.publicKey,
      farmer: farmer.publicKey,
      farmlink: await this.findFarmLinkPDA(farmName),
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    try {
      await this.program.methods
        .deliverProduct()
        .accounts(accounts)
        .signers([consumer, farmer])
        .rpc();
      console.log("Product delivered successfully");
    } catch (error) {
      this.handleError(error);
    }
  }

  private async findFarmLinkPDA(farmName: string): Promise<PublicKey> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("farmlink"), Buffer.from(farmName)],
      this.program.programId
    )[0];
  }

  private async findProductPDA(farmName: string, farmer: Keypair): Promise<PublicKey> {
    const farmLinkPDA = await this.findFarmLinkPDA(farmName);
    return PublicKey.findProgramAddressSync(
      [farmLinkPDA.toBuffer(), farmer.publicKey.toBuffer()],
      this.program.programId
    )[0];
  }

  private async createTreasuryPDA(farmName: string): Promise<PublicKey> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), Buffer.from(farmName)],
      this.program.programId
    )[0];
  }

  private async createMint(authority: Keypair): Promise<PublicKey> {
    return createMint(this.connection, authority, authority.publicKey, null, 6);
  }

  private async createVault(farmName: string, vaultType: string): Promise<PublicKey> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(vaultType), Buffer.from(farmName)],
      this.program.programId
    )[0];
  }

  private async createMetadataAccount(farmer: Keypair): Promise<PublicKey> {
    return getAssociatedTokenAddress(TOKEN_PROGRAM_ID, farmer.publicKey);
  }

  private handleError(error: unknown) {
    if (error instanceof SendTransactionError) {
      console.error("Transaction Error:", error.logs);
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}

