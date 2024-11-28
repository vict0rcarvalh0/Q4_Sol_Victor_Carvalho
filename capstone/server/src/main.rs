use axum::Router;
use dotenv::dotenv;
use std::sync::Arc;

mod db;
mod routes;
mod controllers;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let db_pool = db::init_db().await.expect("Failed to initialize database");
    let shared_state = Arc::new(db_pool);

    let app = routes::app_routes(shared_state); // aasdas

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}