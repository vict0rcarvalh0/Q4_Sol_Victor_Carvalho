mod models;
mod services;
mod controllers;
mod db;

use axum::{routing::get, routing::post, Router};
use controllers::{
    farmer_controller::{create_farmer, delete_farmer, get_farmer, update_farmer},
    product_controller::{create_product, delete_product, get_product, update_product}, transaction_controller::{create_transaction, delete_transaction, get_transaction, update_transaction}
};
use dotenv::dotenv;
use std::env;
use std::sync::Arc;
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL is not set in the environment");

    println!("Connecting to database at: {}", database_url);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    let shared_pool = Arc::new(pool);

    let app = Router::new()
        // Farmer Routes
        .route("/farmer", post(create_farmer))
        .route("/farmer/:id", get(get_farmer).delete(delete_farmer).put(update_farmer))
        
        // Product Routes
        .route("/product", post(create_product))
        .route("/product/:id", get(get_product).put(update_product).delete(delete_product))

        // Transaction Routes
        .route("/transaction", post(create_transaction))
        .route("/transaction/:id", get(get_transaction).put(update_transaction).delete(delete_transaction))
        
        // Health Check Route
        .route("/health", get(|| async { "Healthy!" }))
        .with_state(shared_pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:5000")
        .await
        .unwrap();

    println!("Listening at http://0.0.0.0:5000/ 🦀");

    axum::serve(listener, app).await.unwrap();

    Ok(())
}
