use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

use crate::state::{FarmLink, Product};

#[derive(Accounts)]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub farmer: Signer<'info>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_bytes()],
        bump = farmlink.bump,
    )]
    pub farmlink: Box<Account<'info, FarmLink>>,

    pub farmer_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = farmer,
        seeds = [farmlink.key().as_ref(), farmer_mint.key().as_ref()],
        bump,
        space = Product::INIT_SPACE
    )]
    pub product: Box<Account<'info, Product>>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = farmer,
    )]
    pub farmer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init,
        payer = farmer,
        associated_token::mint = farmer_mint,
        associated_token::authority = product
    )]
    pub spl_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub sol_vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

impl<'info> CreateProduct<'info> {
    // Create product
    pub fn create_product(&mut self, price: u64, bumps: &CreateProductBumps) -> Result<()> {
        self.product.set_inner(Product {
            farmer: self.farmer.key(),
            mint: self.farmer_mint.key(),
            price,
            bump: bumps.product,
        });

        Ok(())
    }

    // Deposit token from the farmer to the vault
    pub fn deposit_token_to_vault(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.farmer_ata.to_account_info(),
            mint: self.farmer_mint.to_account_info(),
            to: self.spl_vault.to_account_info(),
            authority: self.farmer.to_account_info(),
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_context, 1, self.farmer_mint.decimals)?;

        Ok(())
    }
}
