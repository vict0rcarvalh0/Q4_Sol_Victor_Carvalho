use crate::db::DbPool;
use crate::models::farmer::{CreateFarmer, Farmer};
use sqlx::{query_as, query};
use chrono::NaiveDateTime;

pub async fn create_farmer(pool: &DbPool, data: CreateFarmer) -> Result<Farmer, sqlx::Error> {
    let exists = query!(
        "SELECT COUNT(*) as count 
         FROM farmers 
         WHERE email = $1 OR wallet_address = $2",
        data.email,
        data.wallet_address
    )
    .fetch_one(pool)
    .await?;

    if exists.count > Some(0) {
        return Err(sqlx::Error::RowNotFound);
    }

    let created_at: NaiveDateTime = chrono::Local::now().naive_local();
    
    let farmer = query_as::<_, Farmer>(
        "INSERT INTO farmers (email, wallet_address, created_at) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, wallet_address, created_at"
    )
    .bind(&data.email)
    .bind(&data.wallet_address)
    .bind(created_at)
    .fetch_one(pool)
    .await?;
    
    Ok(farmer)
}

pub async fn get_farmer(pool: &DbPool, id: i32) -> Result<Farmer, sqlx::Error> {
    let farmer = query_as::<_, Farmer>(
        "SELECT id, email, password, wallet_address, created_at 
         FROM farmers 
         WHERE id = $1"
    )
    .bind(id)
    .fetch_one(pool)
    .await?;
    
    Ok(farmer)
}

pub async fn update_farmer(pool: &DbPool, id: i32, data: CreateFarmer) -> Result<Farmer, sqlx::Error> {
    let farmer = query_as::<_, Farmer>(
        "UPDATE farmers 
         SET email = $2, password = $3, wallet_address = $4, created_at = now() 
         WHERE id = $1 
         RETURNING id, email, password, wallet_address, created_at"
    )
    .bind(id)
    .bind(&data.email)
    .bind(&data.wallet_address)
    .fetch_one(pool)
    .await?;
    
    Ok(farmer)
}

pub async fn delete_farmer(pool: &DbPool, id: i32) -> Result<u64, sqlx::Error> {
    let rows_deleted = query(
        "DELETE FROM farmers WHERE id = $1"
    )
    .bind(id)
    .execute(pool)
    .await?
    .rows_affected();
    
    Ok(rows_deleted)
}
