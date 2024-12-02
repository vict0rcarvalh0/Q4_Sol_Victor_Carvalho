use crate::models::transaction::CreateTransactionHistory;
use crate::services::transaction_service;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json, response::IntoResponse,
};
use sqlx::{Pool, Postgres};
use std::sync::Arc;
use uuid::Uuid;

pub async fn create_transaction(
    State(pool): State<Arc<Pool<Postgres>>>,
    Json(payload): Json<CreateTransactionHistory>,
) -> impl IntoResponse {
    match transaction_service::create_transaction(&pool, payload).await {
        Ok(transaction) => (StatusCode::CREATED, Json(transaction)).into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()).into_response(),
    }
}

pub async fn get_transaction(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    match transaction_service::get_transaction(&pool, id).await {
        Ok(transaction) => Json(transaction).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Transaction not found").into_response(),
    }
}

pub async fn update_transaction(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<Uuid>,
    Json(payload): Json<CreateTransactionHistory>,
) -> impl IntoResponse {
    match transaction_service::update_transaction(&pool, id, payload).await {
        Ok(transaction) => Json(transaction).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Failed to update transaction").into_response(),
    }
}

pub async fn delete_transaction(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    match transaction_service::delete_transaction(&pool, id).await {
        Ok(_) => StatusCode::OK.into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "Failed to delete transaction").into_response(),
    }
}
