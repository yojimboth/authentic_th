pub mod auth;
pub mod billing;
pub mod compliance;
pub mod loyalty;
pub mod orders;
pub mod tenants;

use axum::Router;
use crate::db::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .merge(auth::routes::routes())
        .merge(tenants::routes::routes())
        .merge(orders::routes::routes())
        .merge(billing::routes::routes())
        .merge(loyalty::routes::routes())
        .merge(compliance::routes::routes())
}