use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Farmer {
    pub id: Uuid,
    pub email: String,
    pub password: String,
    pub wallet_address: String,
}

#[derive(Serialize, Deserialize)]
pub struct CreateFarmer {
    pub email: String,
    pub password: String,
    pub wallet_address: String,
}