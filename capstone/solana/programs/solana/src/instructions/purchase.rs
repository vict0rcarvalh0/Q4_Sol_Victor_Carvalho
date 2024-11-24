use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken, token::{close_account, CloseAccount}, token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked}
};

use crate::state::{FarmLink, Product};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    consumer: Signer<'info>,

    #[account(mut)]
    farmer: SystemAccount<'info>,

    farmer_mint: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_bytes()],
        bump = farmlink.bump,
    )]
    farmlink: Box<Account<'info, FarmLink>>,

    #[account(
        init_if_needed,
        payer = consumer,
        associated_token::mint = farmer_mint,
        associated_token::authority = consumer,
    )]
    consumer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    spl_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"vault", farmer.key().as_ref(), system_program.key().as_ref()],
        bump
    )]
    sol_vault: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"rewards", farmlink.key().as_ref()],
        bump = farmlink.reward_bump,
        mint::decimals = 6,
        mint::authority = farmlink,
    )]
    rewards_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        seeds = [farmlink.key().as_ref(), farmer_mint.key().as_ref()],
        bump = product.bump,
    )]
    product: Box<Account<'info, Product>>,

    #[account(
        mut,
        seeds = [b"treasury", farmlink.key().as_ref()],
        bump = farmlink.treasury_bump,
    )]
    treasury: SystemAccount<'info>,

    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
    token_program: Interface<'info, TokenInterface>,
}

impl<'info> Purchase<'info> {
    // Send the SOL to the vault and the farmlink fee to the treasury
    pub fn send_sol_to_vault(&self) -> Result<()> {
        msg!("CPI program definition");
        let cpi_program = self.system_program.to_account_info();

        msg!("CPI accounts definition");
        let cpi_account = Transfer {
            from: self.consumer.to_account_info(),
            to: self.sol_vault.to_account_info(),
        };

        msg!("Creating CPI context");
        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        msg!("Setting amount to transfer");
        let amount = self
            .product
            .price
            .checked_mul(self.farmlink.fee as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();

        msg!("Transfering SOL to vault");
        transfer(cpi_ctx, self.product.price - amount)?;

        Ok(())
    }

    pub fn send_fee_to_treasury(&self) -> Result<()> {
        msg!("CPI Program definition");
        let cpi_program: AccountInfo<'_> = self.system_program.to_account_info();

        msg!("CPI accounts definition");
        let cpi_account = Transfer {
            from: self.consumer.to_account_info(),
            to: self.treasury.to_account_info(),
        };

        msg!("Creating CPI context");
        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        msg!("Setting amount to transfer");
        let amount = self
            .product
            .price
            .checked_mul(self.farmlink.fee as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();

        msg!("Transfering marketplace fee to treasury");
        transfer(cpi_ctx, amount)?;

        Ok(())
    }

    // Send the token to the consumer and the reward to the farmer
    pub fn send_token_to_consumer(&mut self) -> Result<()> {
        let binding = self.farmlink.key();
        let seeds = &[
            &binding.as_ref(),
            &self.farmer_mint.key().to_bytes()[..],
            &[self.product.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        msg!("CPI program definition");
        let cpi_program = self.token_program.to_account_info();

        msg!("CPI accounts definition");
        let cpi_accounts = TransferChecked {
            from: self.spl_vault.to_account_info(),
            mint: self.farmer_mint.to_account_info(),
            to: self.consumer_ata.to_account_info(),
            authority: self.product.to_account_info(),
        };

        msg!("Creating CPI context");
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        msg!("Transfering token to consumer");
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
            account: self.spl_vault.to_account_info(),
            destination: self.farmer.to_account_info(),
            authority: self.product.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, close_accounts, signer_seeds);

        close_account(cpi_ctx);

        Ok(())
    }
}
