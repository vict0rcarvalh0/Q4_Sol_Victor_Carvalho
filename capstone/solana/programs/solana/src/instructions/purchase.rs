use anchor_lang::prelude::*;

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

    #[account(
        mut,
        associated_token::authority = product,
        associated_token::mint = farmer_mint,
    )]
    vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [b"rewards", farmlink.key().as_ref()],
        bump = farmlink.rewards_bump,
        mint::decimals = 6,
        mint::authority = farmlink,
    )]
    rewards: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        close = farmer,
        seeds = [farmlink.key().as_ref(), farmer_mint.key().as_ref()],
        bump = product.bump,
    )]
    product: Box<Account<'info, Product>>,

    #[account(
        seeds = [b"treasury", farmlink.key().as_ref()],
        bump = farmlink.treasury_bump,
    )]
    treasury: SystemAccount<'info>,

    associated_token_program: Program<'info, AssociatedToken>,

    system_program: Program<'info, System>,

    token_program: Interface<'info, TokenInterface>,
}

impl<'info> Purchase<'info> {
    pub fn send_sol(&self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_account = Transfer{
            from: self.consumer.to_account_info(),
            to: self.farmer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let amount = self.product.price.checked_sub(self.farmlink.fee as u64).unwrap();

        transfer(cpi_ctx, amount)?;

        let cpi_program = self.system_program.to_account_info();

        let cpi_account = Transfer{
            from: self.consumer.to_account_info(),
            to: self.treasury.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let marketplace_fee = (self.farmlink.fee as u64)
            .checked_div(10000 as u64).unwrap()
            .checker_mul(self.product.price as u64);

        transfer(cpi_ctx, marketplace_fee);

        Ok(())
    }

    pub fn send_nft(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info(); 

        let cpi_accounts = TransferChecked{
            from: self.vault.to_account_info(),
            to: self.farmer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

        let amount = self.product.price.checked_sub(self.farmlink.fee as u64).unwrap();

        transfer(cpi_ctx, amount)?;

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked{
            from: self.farmer_ata.to_account_info(),
            mint: self.farmer_mint.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.farmer.to_account_info(),
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_context, 1, self.farmer_mint.decimals)?;

        Ok(())
    }

    pub fn close_mint_vault(&mut self) -> Result<()> {
        let seeds = &[
            &self.farmlink.key().to_bytes()[..],
            &self.farmlink.key().to_bytes()[..],
            &[self.product.bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();

        let close_accounts = CloseAccount{
            account: self.vault.to_account_info(),
            destination: self.farmer.to_account_info(),
            authority: self.product.to_account_info()
        };

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, close_accounts, signer_seeds);

        close_accounts(cpi_ctx);

        Ok(())
    }
}