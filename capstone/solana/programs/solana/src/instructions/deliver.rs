use anchor_lang::prelude::*;
use anchor_spl::{
    token::Token,
    token_interface::{burn, transfer, Burn, Mint, TokenAccount, Transfer},
};

use crate::state::{
    FarmLink, 
    Product
};

#[derive(Accounts)]
pub struct Deliver<'info> {
    #[account(mut)]
    pub consumer: Signer<'info>,

    #[account(mut)]
    pub farmer: Signer<'info>,

    pub farmer_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = farmer,
    )]
    pub farmer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = consumer,
    )]
    consumer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_bytes()],
        bump = farmlink.bump
    )]
    pub farmlink: Account<'info, FarmLink>,

    #[account(
        mut,
        close = farmer,
        seeds = [farmlink.key().as_ref(), farmer_mint.key().as_ref()],
        bump = product.bump,
    )]
    pub product: Box<Account<'info, Product>>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = product,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Deliver<'info> {
    // Burn consumer token
    pub fn burn_consumer_token(&self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = Burn {
            mint: self.farmer_mint.to_account_info(),
            from: self.consumer_ata.to_account_info(),
            authority: self.consumer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        let amount_to_burn = 1;

        burn(cpi_ctx, amount_to_burn)?;

        Ok(())
    }

    // Transfer funds from the vault to the farmer
    pub fn transfer_vault_funds_to_farmer(&self) -> Result<()> {
        let farmer_binding = self.farmer.key();
        let farmer_mint_binding = self.farmer_mint.key();
        let seeds = &[farmer_binding.as_ref(), farmer_mint_binding.as_ref(), &[self.product.bump]];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.farmer_ata.to_account_info(),
            authority: self.product.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, 1)?;

        Ok(())
    }
}