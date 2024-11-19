use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Deliver<'info> {
    #[account(mut)]
    pub farmer: Signer<'info>,

    pub farmer_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = farmer_mint,
        associated_token::authority = farmer,
    )]
    pub farmer_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"farmlink", farmlink.name.as_str().as_ref()],
        bump = marketplace.bump
    )]
    pub farmlink: Account<'info, FarmLink>,

    #[account(
        mut,
        close = maker,
        seeds = [maker.key().as_ref(), maker_mint.key().as_ref()],
        bump,
    )]
    pub product: Box<Account<'info, Product>>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = product,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Deliver<'info> {
    pub fn deliver_product(&self, bumps: &InitializeBumps) -> Result<()> {
        self.product.set_inner(Product {
            farmer: self.farmer.key(),
            mint: self.maker_mint.key(),
            price: self.product.price,
            bump: bumps.product,
        });

        Ok(())
    }

    // burn consumer token -> signer

    // transfer funds from the vault to the farmer
}