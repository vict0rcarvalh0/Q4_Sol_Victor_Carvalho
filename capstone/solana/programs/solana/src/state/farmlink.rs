use anchor_lang::prelude::*;

// FarmLink state
#[account]
pub struct FarmLink {
    pub farmer: Pubkey,
    pub fee: u16,
    pub bump: u8,
    pub treasury_bump: u8,
    pub reward_bump: u8,
    pub sol_vault_bump: u8,
    pub name: String,
}

impl Space for FarmLink {
    const INIT_SPACE: usize = 8 + 32 + 2 + 4 + (4 * 32);
}
