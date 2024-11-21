use anchor_lang::error_code;

#[error_code]
pub enum FarmLinkError {
    #[msg("FarmLinkError: Farmlink name should be greater than 0 and less than 32 characters")]
    NameTooLong,
}