use anchor_lang::prelude::*;

#[account]
pub struct Marketplace {
    pub admin: PubKey,
    pub fee: u16,
    pub bump: u8,
    pub treasury_bump: u8, // what will save the fees
    pub reward_bump: u8, // reward token
    pub name: String // string always in the bottom of struct to use the other fields as indexes
}

impl Space for Marketplace {
    const INIT_SPACE: usize = 8 + 32 + 2 + 3*1 + (4 + 32); //  4 is a extra space that borsch will need to selialize and desialize a string
}