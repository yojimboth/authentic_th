use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use api_gateway::config::Config;
use api_gateway::db::{create_app_state, AppState};
use api_gateway::create_router;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "api_gateway=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = Config::from_env();

    tracing::info!("Starting API Gateway on port {}", config.port);

    let app_state = match create_app_state(&config).await {
        Ok(state) => state,
        Err(e) => {
            tracing::error!("Failed to create app state: {}", e);
            std::process::exit(1);
        }
    };

    let app = create_router().with_state(app_state.clone());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port))
        .await
        .expect("Failed to bind to port");

    tracing::info!("API Gateway listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}