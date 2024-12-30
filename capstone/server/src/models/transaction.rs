use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct TransactionHistory {
    pub id: i32,
    pub hash: String,
    pub sender_wallet: String,
    pub receiver_wallet: String,
    pub amount: f64, 
    pub product_address: Option<i32>, 
    pub transaction_type: String,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateTransactionHistory {
    pub hash: String,
    pub sender_wallet: String,
    pub receiver_wallet: String,
    pub amount: f64,
    pub product_address: Option<i32>,
    pub transaction_type: String,
}