use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub category: String,
    pub unit: String,
    pub total_amount: f64,
    pub price_per_unit: f64,
    pub available_quantity: f64,
    pub status: String,
    pub farmer_id: Uuid,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateProduct {
    pub name: String,
    pub description: String,
    pub category: String,
    pub unit: String,
    pub total_amount: f64,
    pub price_per_unit: f64,
    pub available_quantity: f64,
    pub status: String,
    pub farmer_id: Uuid,
}
