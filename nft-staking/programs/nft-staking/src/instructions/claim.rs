// use anchor_lang::prelude::*;

// pub struct Claim<'info> {
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(
//         mut,
//         seeds = [b"user".as_ref(), user.key().as_ref()],
//         bump = user_account.bump,
//     )]
//     pub user_account: Account<'info, UserAccount>,
// } 