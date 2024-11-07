use anchor_lang::error_code;

#[error_code]
pub enum MarketplaceError {
    #[msg("The lenght of the provided name should size between 1 and 32")]
    NameTooLong,
}