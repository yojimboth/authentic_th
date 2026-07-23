use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::loyalty::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/loyalty/:tenant_id/config", get(handlers::get_loyalty_config).post(handlers::create_loyalty_config))
        .route("/loyalty/:tenant_id/earn", post(handlers::earn_points))
        .route("/loyalty/:tenant_id/redeem", post(handlers::redeem_points))
        .route("/loyalty/:tenant_id/customers/:customer_email", get(handlers::get_customer_loyalty))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}