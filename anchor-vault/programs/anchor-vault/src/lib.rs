use anchor_lang::prelude::*;
use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

mod state;
use state::*;

mod context;
use context::*;

declare_id!("4jUN6DKrJSn9QGorzcX5xnQf9irrj5aC5sX4FjoqqPWo");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;

        Ok(())
    }

    pub fn deposit(ctx: Context<Operations>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Operations>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)?;

        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()?;

        Ok(())
    }
}