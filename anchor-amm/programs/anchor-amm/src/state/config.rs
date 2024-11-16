use anchor::prelude::*;
use crate::constants::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub mint_x: Pubkey, // token x of the pair
    pub mint_y: Pubkey, // token y of the pair
    pub authority: Option<Pubkey>, // if want a authority for config account
    pub seed: u64, // seed to be able to create different pools/configs
    pub fee: u16, // would be to the liquidity provider
    pub locked: bool, // lock amm function(pool) for a certain period of time by authority
    pub config_bump: u8, // bump seed for the config account
    pub lp_token: u8, // liquidity provider token(nominal representation), show ratio of the unit of each token
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