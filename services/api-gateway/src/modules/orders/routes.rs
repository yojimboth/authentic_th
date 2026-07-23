use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::orders::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/orders", get(handlers::list_orders).post(handlers::create_order))
        .route("/orders/:order_id", get(handlers::get_order).patch(handlers::update_order_status))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}