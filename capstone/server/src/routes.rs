use axum::{Router, routing::post};
use std::sync::Arc;
use sqlx::postgres::PgPool;

use crate::controllers::farmer_controller;

pub fn app_routes(pool: Arc<PgPool>) -> Router {
    Router::new().route("/farmers", post(farmer_controller::create_farmer)).with_state(pool)
}