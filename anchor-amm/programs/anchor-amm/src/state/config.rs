use anchor::prelude::*;
use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub mint_x: Pubkey,
    pub mint_y: Pubkey,
    pub authority: Pubkey,
    pub seed: u64,
    pub fee: u16, // would be to the liquidity provider
    pub locked: bool, // lock amm function for a certain period of time
    pub auth_bump: u8,
    pub config_bump: u8,
}

impl Config {
    pub const LEN: usize = 8 + PUBKEY_L*3 + U64_L + U16_L + BOOL_L + U8_L*2;
    
    pub fn init(
        &mut self,
        mint_x: Pubkey,
        mint_y: Pubkey,
        authority: Pubkey,
        seed: u64,
        fee: u16,
        locked: bool,
        auth_bump: u8,
        config_bump: u8,
    ) {
        self.seed = seed;
        self.authority = authority;
        self.mint_x = mint_x;
        self.mint_y = mint_y;
        self.fee = fee;
        self.locked = false;
        self.auth_bump = auth_bump;
        self.config_bump = config_bump;
    }
}