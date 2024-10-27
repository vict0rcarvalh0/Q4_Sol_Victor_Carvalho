use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

declare_id!("4jUN6DKrJSn9QGorzcX5xnQf9irrj5aC5sX4FjoqqPWo");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;

        Ok(())
    }

    pub fn deposit(ctx: Context<Operations>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Operations>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)?;

        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)] // mutable because we are changing the state(deducting lamports by creating the vault)
    pub user: Signer<'info>, // type signer because it is the payer
    #[account{
        init,
        payer = user, 
        seeds = [b"state", user.key.as_ref()],
        bump, // anchor will find the cannonical bump for this account
        space = 8 + VaultState::INIT_SPACE
    }]
    pub vault_state: Account<'info, VaultState>, // where the magic happens and where the accounts serializer is used
    #[account{
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    }]
    pub vault: SystemAccount<'info>, // system account is an account owned by the system program(don't store any state/data, only holds amount of lamports that an account hold)
    pub system_program: Program<'info, System>, // every account created needs the system program
}

#[derive(Accounts)]
pub struct Operations<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account{
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump, // bump is already stored in the vault_state
    }]
    pub vault: SystemAccount<'info>, // not mutable because we are not changing the vault, only the lamports
    #[account{
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
    }]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>
}


impl<'info> Operations<'info> {
    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
            // authority: self.user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, amount)?; // ? is used to return an error if the transfer fails

        Ok(())
    }

    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.vault_bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account{
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump, // bump is already stored in the vault_state
    }]
    pub vault: SystemAccount<'info>, // not mutable because we are not changing the vault, only the lamports
    #[account{
        mut,
        seeds = [b"state", user.key().as_ref()],
        bump = vault_state.state_bump,
        close = user // in the end of the method close the vault account and send the rent back to the specified
    }]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>
}

impl<'info> Close<'info> {
    pub fn close (&mut self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.vault_bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, self.vault.lamports())?;
        Ok(())
    }
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> { // 
        self.vault_state.vault_bump = bumps.vault;
        self.vault_state.state_bump = bumps.vault_state;

        Ok(())
    }
} 

#[account]
// #[derive(InitSpace)] // needs to explicitly add 8 bytes in the space when using it
pub struct VaultState {
    pub vault_bump: u8, // where sol will be storaged
    pub state_bump: u8, // state account to start the bumps of the pdas to do the verification after
}

impl Space for VaultState {
    const INIT_SPACE: usize = 8 + 1 + 1; // anchor discriminator + bump + bump(bytes)
}
