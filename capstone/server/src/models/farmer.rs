use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Farmer {
    pub id: Uuid,
    pub email: String,
    pub password: String,
    pub wallet_address: String,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct CreateFarmer {
    pub email: String,
    pub password: String,
    pub wallet_address: String,
}