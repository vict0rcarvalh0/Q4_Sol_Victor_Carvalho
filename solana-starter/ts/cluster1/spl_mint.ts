import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wallet/wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

const mint = new PublicKey("8Hatm9HwkZWFjJBdUSTqZKiLumELUYUALZZ5sh4CP4Bm");

(async () => {
    try {
        const ata = await  getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`); // 6riEYhTRXimEtL34rArP75yFUmVYB4mf5pr8bHRayndL

        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair, 1n* token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
