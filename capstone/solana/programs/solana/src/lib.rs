use anchor_lang::prelude::*;

declare_id!("3vJaEJMGZ6yiRtpxgctoxqnsUu73PRUJP5tJAUyCVPRX");

#[program]
pub mod solana {
    use super::*;

    // Initialize FarmLink
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // Create product

    // Purchase product

    // Deliver product

    // Refund consumer

    // Refund farmer
}

#[derive(Accounts)]
pub struct Initialize {}
