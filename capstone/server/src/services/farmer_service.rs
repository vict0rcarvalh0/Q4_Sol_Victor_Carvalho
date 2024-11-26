use crate::db::DbPool;
use crate::models::farmer::{CreateFarmer, Farmer};
use uuid::Uuid;

pub async fn create_farmer(pool: &DbPool, data: CreateFarmer) -> Result<Farmer, sqlx::Error> {
    let farmer = sqlx::query_as!(
        Farmer,
        "INSERT INTO farmers (id, email, password, wallet_address) VALUES ($1, $2, $3, $4) RETURNING *",
        Uuid::new_v4(),
        data.email,
        data.password,
        data.wallet_address
    )
    .fetch_one(pool)
    .await?;
    Ok(farmer)
}
