use anchor_lang::prelude::*;

declare_id!("8tooD7yeL5tYeWWsz3pegP9din78nrqgkrQPC5wq3cag");

#[program]
pub mod anchor_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
