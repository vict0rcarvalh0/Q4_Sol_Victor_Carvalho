use anchor::prelude::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub provider: Signer<'info>,
    pub mint_x: Box<InterfaceAccount<'info, Mint>>,
    pub mint_y: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint_x,
        associated_token::authority = auth,
    )]
    pub vault_x: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint_y,
        associated_token::authority = auth,
    )]
    pub vault_y: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        seeds = [b"auth"],
        bump,
    )]
    pub auth: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = provider,
        seeds = [b"provider", config_key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = provider
    )]
    pub mint_lp: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = provider,
        associated_token::mint = mint_y,
        associated_token::authority = provider,
    )]
    pub provider_y: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint_lp,
        associated_token::authority = provider,
    )]
    pub provider_lp: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
    )]
    pub config: Account<'info, Config>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl <'info> Deposit<'info> {
    pub fn deposit(&mut self, is_x: bool, amount: u64) -> Result<()> {
        let mint;

        // let(from, to) = match is_x {
        //     true ->
        // }

        Ok(())
    }
}