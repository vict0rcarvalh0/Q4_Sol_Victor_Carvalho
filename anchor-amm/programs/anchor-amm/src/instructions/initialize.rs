use anchor::prelude::*;
use crate::state::Config;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub mint_x: Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,

    #[account(
        init,
        payer = initializer,
        associated_token::mint = mint_x,
        associated_token::authority = config,
    )]
    pub vault_x: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = initializer,
        associated_token::mint = mint_y,
        associated_token::authority = config,
    )]
    pub vault_y: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = initializer,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        space = Config::LEN,
    )]
    pub config: Account<'info, Config>,

    #[account(
        init,
        payer = initializer,
        seeds = [b"lp", config.key().as_ref()],
        bump,
        mint::decimals = 0,
        mint::authority = 
    )]
    pub mint_lp: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    // initialize token accounts and the pool
    pub fn init(&mut self, seed: u64, fee: u16, authority: Option<Pubkey>, bumps: &InitializeBumps) -> Result<()> {
        require!(fee<-10000, AmmError::FeePercentErr);

        self.config.set_inner(Config {
            mint_x: self.mint_x.key(),
            mint_y: self.mint_y.key(),
            authority,
            seed,
            fee,
            locked: false,
            config_bump: bumps.config, 
            lp_bump: bumps.mint_lp 
        });

        Ok(())
    }
}