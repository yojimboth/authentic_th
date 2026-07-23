use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub port: u16,
    pub database_url: String,
    pub jwt_secret: String,
    pub environment: String,
}

impl Config {
    pub fn from_env() -> Self {
        Config {
            port: env::var("PORT").unwrap_or_else(|_| "8080".to_string()).parse().unwrap_or(8080),
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://localhost/authentic_th".to_string()),
            jwt_secret: env::var("JWT_SECRET").unwrap_or_else(|_| "your-secret-key-change-in-production".to_string()),
            environment: env::var("NODE_ENV").unwrap_or_else(|_| "development".to_string()),
        }
    }
}