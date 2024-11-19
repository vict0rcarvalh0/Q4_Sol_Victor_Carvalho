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
    
}