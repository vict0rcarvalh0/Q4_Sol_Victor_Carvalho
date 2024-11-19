use anchor_lang::error_code;

#[error_code]
pub enum FarmLinkError {
    #[msg("FarmLinkError: Invalid instruction")]
    InvalidInstruction,
}