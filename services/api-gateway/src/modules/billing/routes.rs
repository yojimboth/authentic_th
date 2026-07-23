use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::billing::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/billing/:tenant_id/config", get(handlers::get_billing_config).post(handlers::create_billing_config).patch(handlers::update_billing_config))
        .route("/billing/:tenant_id/payments", post(handlers::create_payment_intent))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}