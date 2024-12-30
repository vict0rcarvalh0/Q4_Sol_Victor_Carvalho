use crate::db::DbPool;
use crate::models::product::{CreateProduct, Product};
use sqlx::{query_as, query};

// Create a new product
pub async fn create_product(pool: &DbPool, data: CreateProduct) -> Result<Product, sqlx::Error> {
    let created_at = chrono::Local::now().naive_local();
    
    let product = query_as::<_, Product>(
        "INSERT INTO products (name, description, category, unit, total_amount, price_per_unit, available_quantity, status, farmer_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, name, description, category, unit, total_amount, price_per_unit, available_quantity, status, farmer_id, created_at"
    )
    .bind(&data.name)
    .bind(&data.description)
    .bind(&data.category)
    .bind(&data.unit)
    .bind(data.total_amount)
    .bind(data.price_per_unit)
    .bind(data.available_quantity)
    .bind(&data.status)
    .bind(data.farmer_id)
    .bind(created_at)
    .fetch_one(pool)
    .await?;

    Ok(product)
}

// Get a product by ID
pub async fn get_product(pool: &DbPool, id: i32) -> Result<Product, sqlx::Error> {
    let product = query_as::<_, Product>(
        "SELECT id, name, description, category, unit, total_amount, price_per_unit, available_quantity, status, farmer_id, created_at 
        FROM products WHERE id = $1"
    )
    .bind(id)
    .fetch_one(pool)
    .await?;

    Ok(product)
}

// Update a product by ID
pub async fn update_product(pool: &DbPool, id: i32, data: CreateProduct) -> Result<Product, sqlx::Error> {
    let product = query_as::<_, Product>(
        "UPDATE products 
        SET name = $2, description = $3, category = $4, unit = $5, total_amount = $6, price_per_unit = $7, available_quantity = $8, status = $9
        WHERE id = $1 
        RETURNING id, name, description, category, unit, total_amount, price_per_unit, available_quantity, status, farmer_id, created_at"
    )
    .bind(id)
    .bind(&data.name)
    .bind(&data.description)
    .bind(&data.category)
    .bind(&data.unit)
    .bind(data.total_amount)
    .bind(data.price_per_unit)
    .bind(data.available_quantity)
    .bind(&data.status)
    .fetch_one(pool)
    .await?;

    Ok(product)
}

// Delete a product by ID
pub async fn delete_product(pool: &DbPool, id: i32) -> Result<(), sqlx::Error> {
    query("DELETE FROM products WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    
    Ok(())
}
