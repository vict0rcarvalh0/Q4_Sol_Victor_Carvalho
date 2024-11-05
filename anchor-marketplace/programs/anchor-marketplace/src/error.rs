use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("The lenght of the provided name should size between 1 and 32")]
    NameTooLong,
}