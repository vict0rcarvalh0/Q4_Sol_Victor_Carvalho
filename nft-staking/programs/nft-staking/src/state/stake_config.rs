use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeConfig {
    pub points_per_stake: u8,
    pub max_stake: u8,
    pub freeze_period: u32,
    pub rewards_bump: u8,
    pub bump: u8,
}

// impl Space for UserAccount {
//     const INIT_SPACE: usize = 8 + 1 + 1 + 4 + 1 + 1; -> 4 bytes from u32, 1 byte from u8
// }