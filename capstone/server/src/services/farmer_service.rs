use crate::db::DbPool;
use crate::models::farmer::{CreateFarmer, Farmer};
use sqlx::types::Uuid;
use chrono::NaiveDateTime;

pub async fn create_farmer(pool: &DbPool, data: CreateFarmer) -> Result<Farmer, sqlx::Error> {
    let created_at: NaiveDateTime = chrono::Local::now().naive_local();

    let farmer = sqlx::query_as!(
        Farmer,
        "INSERT INTO farmers (id, email, password, wallet_address, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        Uuid::new_v4(),
        data.email,
        data.password,
        data.wallet_address,
        created_at
    )
    .fetch_one(pool)
    .await?;
    Ok(farmer)
}

pub async fn get_farmer(pool: &DbPool, id: Uuid) -> Result<Farmer, sqlx::Error> {
    let farmer = sqlx::query_as!(
        Farmer,
        "SELECT id, email, password, wallet_address, created_at FROM farmers WHERE id = $1",
        id
    )
    .fetch_one(pool)
    .await?;
    
    Ok(farmer)
}

pub async fn update_farmer(pool: &DbPool, id: Uuid, data: CreateFarmer) -> Result<Farmer, sqlx::Error> {
    let farmer = sqlx::query_as!(
        Farmer,
        "UPDATE farmers SET email = $2, password = $3, wallet_address = $4, created_at = now() WHERE id = $1 RETURNING *",
        id,
        data.email,
        data.password,
        data.wallet_address
    )
    .fetch_one(pool)
    .await?;
    
    Ok(farmer)
}

pub async fn delete_farmer(pool: &DbPool, id: Uuid) -> Result<u64, sqlx::Error> {
    let rows_deleted = sqlx::query!(
        "DELETE FROM farmers WHERE id = $1",
        id
    )
    .execute(pool)
    .await?
    .rows_affected();
    
    Ok(rows_deleted)
}