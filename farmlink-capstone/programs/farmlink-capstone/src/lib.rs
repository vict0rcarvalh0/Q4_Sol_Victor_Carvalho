use anchor_lang::prelude::*;

declare_id!("3XXXV3XAM64BzAMa46YYYGVYmaYocjvY9q6vSHspASRF");

#[program]
pub mod farmlink_capstone {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
