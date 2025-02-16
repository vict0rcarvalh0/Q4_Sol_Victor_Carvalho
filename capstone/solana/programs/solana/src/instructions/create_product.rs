use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
    token::Token,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

use crate::state::{FarmLink, Product};

#[derive(Accounts)]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub farmer: Signer<'info>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_bytes()],
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

    /// CHECK: because the metadata account by metaplex don't follow a known structure in anchor
    #[account(
        mut,
        seeds = [b"metadata", metadata_program.key().as_ref(), farmer_mint.key().as_ref()],
        bump,
        seeds::program = metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub metadata_program: Program<'info, Metadata>,

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

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

impl<'info> CreateProduct<'info> {
    pub fn create_product(&mut self, price: u64, bumps: &CreateProductBumps, token_name: String, token_symbol: String, token_uri: String) -> Result<()> {
        self.product.set_inner(Product {
            farmer: self.farmer.key(),
            mint: self.farmer_mint.key(),
            price,
            bump: bumps.product,
        });

        let creators = vec![mpl_token_metadata::types::Creator {
            address: self.farmer.key(),
            verified: true,
            share: 100,
        }];

        let data = mpl_token_metadata::types::DataV2 {
            name: token_name,
            symbol: token_symbol,
            uri: token_uri,
            seller_fee_basis_points: 500,
            creators: Some(creators),
            collection: None,
            uses: None,
        };

        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: self.metadata_account.to_account_info(),
            mint: self.farmer_mint.to_account_info(),
            mint_authority: self.farmer.to_account_info(),
            payer: self.farmer.to_account_info(),
            update_authority: self.farmer.to_account_info(),
            rent: self.rent.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };

        let cpi_context = CpiContext::new(self.metadata_program.to_account_info(), cpi_accounts);

        create_metadata_accounts_v3(
            cpi_context,
            data,
            true,   // is_mutable
            false,   // collection
            None,   // collection_details
        )?;

        Ok(())
    }

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