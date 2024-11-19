use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub farmer: Signer<'info>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_bytes()],
        bump = farmlink.bump,
    )]
    pub farmlink: Account<'info, FarmLink>,

    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = farmer,
        seeds = [farmer.key().as_ref(), token_mint.key().as_ref()], 
        bump,
        space = Product::INIT_SPACE
    )]
    pub product: Account<'info, Product>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = farmer,
    )]
    pub farmer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = farmer,
        associated_token::mint = token_mint,
        associated_token::authority = vault
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>
}

impl<'info> CreateProduct<'info> {
    pub fn create_product(&mut self, price: u64, bumps: &ListBumps) -> Result<()> {
        self.create_product.set_inner(Product {
            farmer: self.farmer.key(),
            mint: self.farmer_mint.key(),
            price,
            bump: bumps.product,
        });

        Ok(())
    }

    pub fn deposit_token(&mut self) -> Result<()> {
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
}