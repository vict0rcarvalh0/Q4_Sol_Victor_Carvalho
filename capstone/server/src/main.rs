mod models;
mod services;
mod controllers;
mod db;

use axum::{routing::get, routing::post, Router};
use controllers::farmer_controller::{create_farmer, delete_farmer, get_farmer, update_farmer};
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
        .route("/farmer", post(create_farmer))
        .route("/farmer/:id", get(get_farmer).delete(delete_farmer).put(update_farmer))
        .route("/health", get(|| async { "Healthy!" }))
        .with_state(shared_pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    println!("Listening at http://0.0.0.0:3000/ 🦀");

    axum::serve(listener, app).await.unwrap();

    Ok(())
}
