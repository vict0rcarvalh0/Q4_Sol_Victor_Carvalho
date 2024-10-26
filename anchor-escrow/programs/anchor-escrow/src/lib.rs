use anchor_lang::prelude::*;
mod state;
mod instructions;

use instructions::*;

declare_id!("vsnAo5Ghk9dCRoAHDdhudxY8HHBvaw6K7JFTvM9dhg2");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
