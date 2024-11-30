use crate::db::DbPool;
use crate::models::product::{CreateProduct, Product};
use sqlx::types::Uuid;
use chrono::NaiveDateTime;

pub async fn create_product(pool: &DbPool, data: CreateProduct) -> Result<Product, sqlx::Error> {
    let created_at: NaiveDateTime = chrono::Local::now().naive_local();

    let product = sqlx::query_as!(
        Product,
        "INSERT INTO products (id, name, description, category, unit, total_amount, price_per_unit, available_quantity, status, farmer_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *",
        Uuid::new_v4(),
        data.name,
        data.description,
        data.category,
        data.unit,
        data.total_amount,
        data.price_per_unit,
        data.available_quantity,
        data.status,
        data.farmer_id,
        created_at
    )
    .fetch_one(pool)
    .await?;

    Ok(product)
}

pub async fn get_product(pool: &DbPool, id: Uuid) -> Result<Product, sqlx::Error> {
    let product = sqlx::query_as!(Product, "SELECT * FROM products WHERE id = $1", id)
        .fetch_one(pool)
        .await?;
    Ok(product)
}

pub async fn update_product(pool: &DbPool, id: Uuid, data: CreateProduct) -> Result<Product, sqlx::Error> {
    let product = sqlx::query_as!(
        Product,
        "UPDATE products SET name = $2, description = $3, category = $4, unit = $5, total_amount = $6, price_per_unit = $7, available_quantity = $8, status = $9 
        WHERE id = $1 RETURNING *",
        id,
        data.name,
        data.description,
        data.category,
        data.unit,
        data.total_amount,
        data.price_per_unit,
        data.available_quantity,
        data.status
    )
    .fetch_one(pool)
    .await?;
    
    Ok(product)
}


pub async fn delete_product(pool: &DbPool, id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!("DELETE FROM products WHERE id = $1", id)
        .execute(pool)
        .await?;
    Ok(())
}
