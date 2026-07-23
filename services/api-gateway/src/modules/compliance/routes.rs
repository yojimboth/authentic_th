use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::compliance::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/compliance/audit-logs", get(handlers::list_audit_logs).post(handlers::log_action))
        .route("/compliance/pii/search", post(handlers::search_pii))
        .route("/compliance/consent", post(handlers::record_consent))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}