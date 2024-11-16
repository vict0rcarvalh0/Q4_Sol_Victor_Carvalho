use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub mint_x: Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,
    #[account(
        has_one = mint_x,
        has_one = mint_y,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"lp", config.key().as_ref()],
        bump = config.lp_bump
    )]
    pub mint_lp: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint_x,
        associated_token::authority = config,
    )]
    pub vault_x: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint_y,
        associated_token::authority = config,
    )]
    pub vault_y: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint_x,
        associated_token::authority = user,
    )]
    pub user_x: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint_y,
        associated_token::authority = user,
    )]
    pub user_y: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint_lp,
        associated_token::authority = config,
    )]
    pub user_lp: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(
        &mut self,
        amount: u64, // amount of LP tokens wanted to withdraw(burn) because this user it will not have a share of the pool anymore
        min_x: u64, // minimum amount of token X that the user wants to receive
        min_y: u64, // minimum amount of token Y that the user wants to receive
    ) -> Result<()> {
        require(&self.config.locked == false, AmmError::PoolLocked); // check if the config account(pool) is locked
        require(amount != 0, AmmError::InvalidAmount); // check if the amount of the user lp is bigger of the amount that he is passing to
        require(min_x != 0 && min_y != 0, AmmError::InvalidMinAmount); // check if the min amount of token x and y is bigger than 0

        let amounts = ConstantProduct::wy_withdraw_amounts_from_l(
            self.vault_x.amount,
            self.vault_y.amount,
            self.mint_lp.supply,
            amount,
            6  // decimals precision of the pool
        ).map_err(AmmError::from)?;

        require(min_x <= amounts.x && min_y <= amounts.y, AmmError::SlippageExceeded); // check if the min amount of token x and y is bigger than the amounts of token x and y that the user will receive
    
        Ok(())
    }

    pub fn withdraw_tokens(&self, is_x: bool, amount: u64) -> Result<()> {
        leet (from, to) = match is_x {
            true => (self.vault_x.to_account_info(), self.user_x.to_account_info()),
            false => (self.vault_y.to_account_info(), self.user_y.to_account_info()),
        };

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = Transfer {
            from,
            to,
            authority: self.config.to_account_info(),
        };

        let seeds = &[b"config"[..], &self.config.seed.to_le_bytes() ,&[self.config.config_bump]];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount)?;

        Ok(())    
    }

    pub fn burn_lp_tokens(&self, amount: u64) -> Result<()> {
        let cpi_program = self.associated_token_program.to_account_info();

        let cpi_accounts = Burn {
            mint: self.mint_lp.to_account_info(),
            to: self.user_lp.to_account_info(),
            authority: self.config.to_account_info(),
        };

        let seeds = &[b"lp"[..], &self.config.key().to_le_bytes(), &[self.config.lp_bump]];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        burn(cpi_ctx, amount)?;

        Ok(())
    }
}