use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Refund {

}

impl<'info> Refund {
    pub fn refund_consumer(&self) -> Result<()> {
        Ok(())
    }

    pub fn refund_farmer(&self) -> Result<()> {
        Ok(())
    }
}