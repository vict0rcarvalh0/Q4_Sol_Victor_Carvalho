use anchor_lang::prelude::*;

declare_id!("4yi1JvRGv6ETmpkDsiC2tby35gVtBf2Hq3zkmKNwGLxx");

#[program]
pub mod anchor_amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
