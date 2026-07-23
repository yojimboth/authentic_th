use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::sync::Arc;

use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub config: Arc<Config>,
}

pub async fn create_pool(database_url: &str) -> Result<PgPool, anyhow::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await
        .map_err(|e| anyhow::anyhow!("Database connection failed: {}", e))?;

    Ok(pool)
}

pub async fn create_app_state(config: &Config) -> Result<AppState, anyhow::Error> {
    let pool = create_pool(&config.database_url).await?;

    Ok(AppState {
        pool,
        config: Arc::new(config.clone()),
    })
}