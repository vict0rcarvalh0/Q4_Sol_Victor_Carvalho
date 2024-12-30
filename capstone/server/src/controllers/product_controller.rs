use crate::models::product::CreateProduct;
use crate::services::product_service;
use axum::{extract::State, http::StatusCode, Json, response::IntoResponse};
use sqlx::Pool;
use sqlx::Postgres;
use std::sync::Arc;

pub async fn create_product(
    State(pool): State<Arc<Pool<Postgres>>>,
    Json(payload): Json<CreateProduct>,
) -> impl IntoResponse {
    match product_service::create_product(&pool, payload).await {
        Ok(product) => (StatusCode::CREATED, Json(product)).into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()).into_response(),
    }
}

pub async fn get_product(
    State(pool): State<Arc<Pool<Postgres>>>,
    axum::extract::Path(id): axum::extract::Path<i32>,
) -> impl IntoResponse {
    match product_service::get_product(&pool, id).await {
        Ok(product) => Json(product).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Product not found").into_response(),
    }
}

pub async fn update_product(
    State(pool): State<Arc<Pool<Postgres>>>,
    axum::extract::Path(id): axum::extract::Path<i32>,
    Json(payload): Json<CreateProduct>,
) -> impl IntoResponse {
    match product_service::update_product(&pool, id, payload).await {
        Ok(product) => Json(product).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Failed to update product").into_response(),
    }
}

pub async fn delete_product(
    State(pool): State<Arc<Pool<Postgres>>>,
    axum::extract::Path(id): axum::extract::Path<i32>,
) -> impl IntoResponse {
    match product_service::delete_product(&pool, id).await {
        Ok(_) => StatusCode::OK.into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Failed to delete product").into_response(),
    }
}
