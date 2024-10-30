use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)] // size of this account
pub struct UserAccount {
    pub points: u32,
    pub amount_staked: u8, // u8 -> 266 limit
    pub bump: u8,
}

// impl Space for UserAccount {
//     const INIT_SPACE: usize = 8 + 4 + 1 + 1; -> 4 bytes from u32, 1 byte from u8
// }