use anchor_lang::prelude::*;
use anchor_spl::{token::Token, token_interface::Mint};

use crate::errors::FarmLinkError;
use crate::state::FarmLink;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub farmer: Signer<'info>,

    #[account(
        init,
        payer = farmer,
        seeds = [b"farmlink", name.as_bytes()],
        bump,
        space = FarmLink::INIT_SPACE
    )]
    pub farmlink: Account<'info, FarmLink>,

    #[account(
        seeds = [b"treasury", farmlink.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>,

    #[account(
        init,
        payer = farmer,
        seeds = [b"rewards", farmlink.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = farmlink
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [b"sol_vault", farmlink.key().as_ref()],
        bump
    )]
    pub sol_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

impl<'info> Initialize<'info> {
    // Initialize the FarmLink
    pub fn initialize(&mut self, name: String, fee: u16, bumps: &InitializeBumps) -> Result<()> {
        require!(
            name.len() > 0 && name.len() < 33,
            FarmLinkError::NameTooLong
        );

        self.farmlink.set_inner(FarmLink {
            farmer: self.farmer.key(),
            fee,
            bump: bumps.farmlink,
            treasury_bump: bumps.treasury,
            reward_bump: bumps.rewards_mint,
            sol_vault_bump: bumps.sol_vault,
            name,
        });

        Ok(())
    }
}
