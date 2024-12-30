use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Farmer {
    pub id: i32,
    pub email: String,
    pub wallet_address: String,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct CreateFarmer {
    pub email: String,
    pub wallet_address: String,
}