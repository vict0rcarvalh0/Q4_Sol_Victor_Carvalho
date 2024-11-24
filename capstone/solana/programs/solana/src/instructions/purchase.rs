use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{close_account, CloseAccount},
    token_interface::{transfer, transfer_checked, Mint, TokenAccount, TokenInterface, Transfer, TransferChecked,
    },
};

use crate::state::{
    FarmLink,
    Product
};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub consumer: Signer<'info>,

    #[account(mut)]
    pub farmer: SystemAccount<'info>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = farmer,
    )]
    pub farmer_ata: InterfaceAccount<'info, TokenAccount>,

    pub farmer_mint: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_bytes()],
        bump = farmlink.bump,
    )]
    pub farmlink: Box<Account<'info, FarmLink>>,

    #[account(
        init_if_needed,
        payer = consumer,
        associated_token::mint = farmer_mint,
        associated_token::authority = consumer,
    )]
    pub consumer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::authority = product,
        associated_token::mint = farmer_mint,
    )]
    pub vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"rewards", farmlink.key().as_ref()],
        bump = farmlink.reward_bump,
        mint::decimals = 6,
        mint::authority = farmlink,
    )]
    pub rewards_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        close = farmer,
        seeds = [farmlink.key().as_ref(), farmer_mint.key().as_ref()],
        bump = product.bump,
    )]
    pub product: Box<Account<'info, Product>>,

    #[account(
        seeds = [b"treasury", farmlink.key().as_ref()],
        bump = farmlink.treasury_bump,
    )]
    pub treasury: SystemAccount<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,

    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> Purchase<'info> {
    // Send the SOL to the vault and the marketplace fee to the treasury
    pub fn send_sol_to_vault(&self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_account = Transfer {
            from: self.consumer.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.consumer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let amount = self
            .product
            .price
            .checked_sub(self.farmlink.fee as u64)
            .unwrap();

        transfer(cpi_ctx, amount)?;

        let cpi_program = self.system_program.to_account_info();

        let cpi_account = Transfer {
            from: self.consumer.to_account_info(),
            to: self.treasury.to_account_info(),
            authority: self.consumer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let marketplace_fee = (self.farmlink.fee as u64)
            .checked_mul(self.farmlink.fee as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();

        transfer(cpi_ctx, marketplace_fee);

        Ok(())
    }

    // Send the token to the consumer and the reward to the farmer
    pub fn send_token_to_consumer(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.farmer_ata.to_account_info(),
            mint: self.farmer_mint.to_account_info(),
            to: self.consumer_ata.to_account_info(),
            authority: self.farmer.to_account_info(),
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_context, 1, self.farmer_mint.decimals)?;

        Ok(())
    }

    // Close the vault account
    pub fn close_mint_vault(&mut self) -> Result<()> {
        let seeds = &[
            &self.farmlink.key().to_bytes()[..],
            &self.farmer_mint.key().to_bytes()[..],
            &[self.product.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();

        let close_accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.farmer.to_account_info(),
            authority: self.product.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, close_accounts, signer_seeds);

        close_account(cpi_ctx);

        Ok(())
    }
}