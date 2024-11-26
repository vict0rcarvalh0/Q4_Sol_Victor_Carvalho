use axum::{extract::State, Json};
use crate::{services::farmer_service, db::DbPool, models::farmer::CreateFarmer};

pub async fn create_farmer(
    State(pool): State<DbPool>,
    Json(payload): Json<CreateFarmer>,
) -> Result<Json<CreateFarmer>, String> {
    farmer_service::create_farmer(&pool, payload)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}
