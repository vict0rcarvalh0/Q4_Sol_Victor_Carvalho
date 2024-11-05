#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_ref()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    pub maker_mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        associated_token::mint = maker_mint,
        associated_token::authority = maker
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [maker.key().as_ref(), maker_mint.key().as_ref()], // why maker mint and not ata?
        bump = listing.bump, // diff between key() and key?
    )]
    pub listing: Account<'info, Listing>,
    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = maker_mint,
        associated_token::authority = taker
    )]
    pub taker_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump = marketplace.reward_bump,
        mint::authority = marketplace
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> Purchase<'info> {
    pub fn send_sol(&self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info(); // what this method do?

        let cpi_account = Transfer{
            from: self.taker.to_account_info(),
            to: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let amount = self.listing.price.checked_sub(self.marketplace.fee as u64).unwrap();

        transfer(cpi_ctx, amount)?;

        let cpi_program = self.system_program.to_account_info();

        let cpi_account = Transfer{
            from: self.taker.to_account_info(),
            to: self.trasury.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let marketplace_fee = (self.marketplace.fee as u64) // not good to deal with float onchain
            .checked_div(10000 as u64).unwrap()
            .checker_mul(self.listing.price as u64);

        transfer(cpi_ctx, marketplace_fee);
    }

    pub fn send_nft(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info(); // what this method do?

        let cpi_accounts = TransferChecked{
            from: self.vault.to_account_info(),
            to: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let amount = self.listing.price.checked_sub(self.marketplace.fee as u64).unwrap();

        transfer(cpi_ctx, amount)?;

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked{
            from: self.maker_ata.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_context, 1, self.maker_mint.decimals)?;
    }
}