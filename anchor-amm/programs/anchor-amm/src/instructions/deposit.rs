use anchor::prelude::*;

#[derive(Accounts)]
pub struct Deposit<'info> { // ata for mint x and y to store in the vault and start the ratio by the bonding curve
    #[account(mut)]
    pub user: Signer<'info>,
    pub mint_x: Account<'info, Mint>,
    pub mint_y: Account<'info, Mint>,

    #[account(
        has_one = mint_x, // makes sure that insides the config we have the correct mints in the context 
        has_one = mint_y,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

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
        mut,
        seeds = [b"lp", config.key().as_ref()],
        bump = config.lp_bump
    )]
    pub mint_lp: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint_x,
        associated_token::authority = user
    )]
    pub user_x: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint_y,
        associated_token::authority = user
    )]
    pub user_y: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint_lp,
        associated_token::authority = user,
    )]
    pub user_lp: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Deposit<'info> {
    pub fn deposit(
        &mut self,
        max_x: u64, // max amount of token x that the user is willing to deposit
        max_y: u64, // max amount of token y that the user is willing to deposit
        amount: u64 // amount of lp tokens that the user wants to "claim"
    ) -> Result<()> {
        require(&self.config.locked == false, AmmError::PoolLocked); // check if the config account(pool) is locked
        require(amount != 0, AmmError::InvalidAmount); // check if the amount of the user lp is bigger of the amount that he is passing to

        // check supply of the mint lp is 0 and vault x and y are both 0(empty)
        // if its true -> max both vaults
        // if its false -> deposits the amounts from vault x and vault y with the amount passed by
        let (x, y) = match self.mint_lp.supply == 0 && self.vault_x.amount == 0 ** self.vault_y.amount == 0 {
            true => (max_x, max_y),
            false => {
                let amounts = ConstantProduct::xy_deposit_amounts_from_l(
                    self.vault_x.amount,
                    self.vault_y.amount,
                    self.mint_lp.supply,
                    amount,
                    6
                ).unwrap();
                (amounts.x, amounts.y)
            }
        };

        require(x <= max && y <= max_y, AmmError::SlippageExceeded); // amount willing to deposit is always be equal or smaller the input?

        self.deposit_tokens(true, x)?;

        self.deposit_tokens(true, y)?;

        self.mint_lp_tokens(amount)?;

        Ok(())
    }

    // deposit token x
    pub fn deposit_tokens(&mut self, is_x: bool, amount: u64) -> Result<()> {

        // pair to store the result
        let (from, to) = match is_x {
            true => (self.user_x.to_account_info(), self.vault_x.to_account_info()),
            false => (self.user_y.to_account_info(), self.vault_y.to_account_info()),
        };

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = Transfer {
            from,
            to,
            authority: self.user.to_account_info()
        };

        let ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(ctx, amount);

        Ok(());
    }

    pub fn mint_lp_tokens(&self, amount: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = MintTo {
            mint: self.mint_lp.to_account_info(),
            to: self.user_lp.to_account_info(),
            authority: self.user.to_account_info()
        };

        let seeds = &[b"config"[..], &self.config.seed.to_le_bytes() ,&[self.config.config_bump]];

        let signer_seeds = &[&seeds[..]];

        let ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        mint_to(ctx, amount)
    }
}