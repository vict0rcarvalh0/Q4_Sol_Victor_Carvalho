use axum::{Router, routing::post};
use crate::controllers::farmer_controller;

pub fn app_routes() -> Router {
    Router::new()
        .route("/farmers", post(farmer_controller::create_farmer))
}
