pub mod config;
pub mod db;
pub mod error;
pub mod middleware;
pub mod modules;
pub mod types;

use axum::Router;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

use crate::db::AppState;

pub fn create_router() -> Router<AppState> {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .merge(modules::routes());

    app.layer(cors)
        .layer(TraceLayer::new_for_http())
}