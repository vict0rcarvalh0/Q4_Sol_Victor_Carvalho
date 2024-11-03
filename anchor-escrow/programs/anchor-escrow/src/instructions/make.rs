use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked}};
use crate::state::Escrow;

#[derive(Accounts)] // accounts context
#[instruction(seed: u64)] // macro that let you access your instruction arguments in the account struct
pub struct Make<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    pub mint_a: InterfaceAccount<'info, Mint>, // check if the program id owner of the mint is the token 22 or the normal token
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account (
        mut, // mutable because will deduct lamports from the ata
        associated_token::mint = mint_a, // checks if this is actually derived from the mint au
        associated_token::authority = maker,
    )]
    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,
    #[account (
        init,
        payer = maker,
        seeds = [b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()], // svm runs in little endian architecture
        bump,
        space = 8 + Escrow::INIT_SPACE,
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(
        init, // every time init is marked, turns the account mutable
        payer = maker,
        associated_token::mint = mint_a,
        associated_token::authority = escrow // will manage the funds of the vault
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
// system account start with 0 and account the space allocation is dynamic

impl<'info> Make<'info> {
    pub fn init_escrow(&mut self, seed: u64, receive: u64, bumps: &MakeBumps) -> Result<()> {
        self.escrow.set_inner(Escrow {
            seed,
            maker: self.maker.key(), // pub key do maker
            mint_a: self.mint_a.key(),
            mint_b: self.mint_b.key(),
            receive, // amount
            bump: bumps.escrow,
        });

        Ok(())
    }

    pub fn deposit(&mut self, amount_deposit: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked { // extra checks to the transfer(who is it from)
            from: self.maker_ata_a.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
            mint: self.mint_a.to_account_info()
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_ctx, amount_deposit, self.mint_a.decimals)?; // checks the decimals of the mint and the amount

        Ok(())
    }
} 