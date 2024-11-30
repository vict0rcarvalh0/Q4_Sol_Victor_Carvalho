// id, hash, sender_wallet, receiver_wallet, amount, product_address, type(poderá ser deliver, purchase ou refund) 

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    pub id: Uuid,
    pub hash: String,
    pub sender_wallet: String,
    pub receiver_wallet: String,
    pub amount: f64,
    pub product_address: String,
    pub transaction_type: String,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct CreateTransaction {
    pub hash: String,
    pub sender_wallet: String,
    pub receiver_wallet: String,
    pub amount: f64,
    pub product_address: String,
    pub transaction_type: String,
}