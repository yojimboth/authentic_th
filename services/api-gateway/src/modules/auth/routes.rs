use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::auth::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/health", get(health_check))
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        .route("/auth/validate-token", post(handlers::validate_token))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}

async fn health_check() -> &'static str {
    "OK"
}