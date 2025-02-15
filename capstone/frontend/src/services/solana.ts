import { Program, AnchorProvider, BN, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import idl from "./solana.json";

const PROGRAM_ID = new PublicKey("FNkU8cgDKePrpyMeVoxZ8CvEJRHkuXReNq2YpsM48SrL");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, window.solana, {
    commitment: "confirmed",
});

const program = new Program(idl as Idl, PROGRAM_ID, provider);

export async function initializeFarmLink(name: string, fee: number) {
    const tx = await program.rpc.initialize(name, fee, {
        accounts: {
            farmLinkAccount: Keypair.generate().publicKey,
            payer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
    });
    console.log("FarmLink initialized with tx:", tx);
}

export async function createProduct(price: number, tokenName: string, tokenSymbol: string, tokenUri: string) {
    const tx = await program.rpc.createProduct(new BN(price), tokenName, tokenSymbol, tokenUri, {
        accounts: {
            productAccount: Keypair.generate().publicKey,
            farmerAccount: provider.wallet.publicKey,
            vaultAccount: Keypair.generate().publicKey,
            systemProgram: SystemProgram.programId,
        },
    });
    console.log("Product created with tx:", tx);
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

async function run() {
    await initializeFarmLink("FarmLink Example", 100);
    await createProduct(1000, "Tomato", "TOM", "https://example.com/tomato.jpg");
    await purchaseProduct();
    await deliverProduct();
}

run().catch(console.error);
