use anchor_lang::prelude::*;

[#account]
pub struct Escrow {
    pub seed: u64,
    pub maker: Pubkey,
    pub mint_a: Pubkey, // mint offered by the maker
    pub mint_b: Pubkey, // mint requested by the taker
    pub receive: u64,
    pub bumps: u8
}