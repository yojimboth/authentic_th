use axum::{
    routing::{get, post},
    Router,
};

use crate::db::AppState;
use crate::middleware::auth;
use crate::modules::tenants::handlers;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/tenants", get(handlers::list_tenants).post(handlers::create_tenant))
        .route("/tenants/:tenant_id", get(handlers::get_tenant).patch(handlers::update_tenant))
        .layer(axum::middleware::from_fn(auth::auth_middleware))
}