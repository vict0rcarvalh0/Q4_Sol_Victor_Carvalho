use crate::{services::farmer_service, models::farmer::CreateFarmer};
use axum::{Json, extract::{State, Path}, response::IntoResponse};
use sqlx::Pool;
use sqlx::Postgres;
use std::sync::Arc;

pub async fn create_farmer(
    State(pool): State<Arc<Pool<Postgres>>>,
    Json(payload): Json<CreateFarmer>,
) -> impl IntoResponse {
    match farmer_service::create_farmer(&pool, payload).await {
        Ok(farmer) => Json(farmer).into_response(),
        Err(err) => (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR, 
            err.to_string()
        ).into_response(),
    }
}

pub async fn get_farmer(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<i32>,
) -> impl IntoResponse {
    match farmer_service::get_farmer(&pool, id).await {
        Ok(farmer) => Json(farmer).into_response(),
        Err(_) => (
            axum::http::StatusCode::NOT_FOUND,
            "Farmer not found".to_string(),
        ).into_response(),
    }
} 

pub async fn get_farmer_by_wallet(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(wallet_address): Path<String>,
) -> impl IntoResponse {
    match farmer_service::get_farmer_by_wallet(&pool, wallet_address.clone()).await {
        Ok(farmer) => Json(farmer).into_response(),
        Err(_) => (
            axum::http::StatusCode::NOT_FOUND,
            format!("Farmer not found: {}", wallet_address),
        ).into_response(),
    }
}

pub async fn update_farmer(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<i32>,
    Json(payload): Json<CreateFarmer>,
) -> impl IntoResponse {
    match farmer_service::update_farmer(&pool, id, payload).await {
        Ok(farmer) => Json(farmer).into_response(),
        Err(_) => (
            axum::http::StatusCode::NOT_FOUND,
            "Farmer not found".to_string(),
        ).into_response(),
    }
}

pub async fn delete_farmer(
    State(pool): State<Arc<Pool<Postgres>>>,
    Path(id): Path<i32>,
) -> impl IntoResponse {
    match farmer_service::delete_farmer(&pool, id).await {
        Ok(0) => (
            axum::http::StatusCode::NOT_FOUND,
            "Farmer not found".to_string(),
        ).into_response(),
        Ok(_) => (
            axum::http::StatusCode::OK,
            "Farmer deleted successfully".to_string(),
        ).into_response(),
        Err(_) => (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to delete farmer".to_string(),
        ).into_response(),
    }
}