use anchor_lang::prelude::*;

// Product state
#[account]
pub struct Product {
    pub farmer: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub bump: u8,
}

impl Space for Product {
    const INIT_SPACE: usize = 8 + 32 + 32 + 8 + 1;
}