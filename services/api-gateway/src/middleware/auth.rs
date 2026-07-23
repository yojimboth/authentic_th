use axum::{
    extract::Request,
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};
use serde::{Deserialize, Serialize};

use crate::error::AppError;
use crate::modules::auth::services;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthClaims {
    pub sub: String,
    pub role: String,
    pub tenant_id: Option<String>,
    pub exp: usize,
}

pub async fn auth_middleware(
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Unauthorized("Invalid authorization header format".to_string()))?;

    let claims = services::validate_token(token)?;

    request
        .extensions_mut()
        .insert(AuthClaims {
            sub: claims.sub,
            role: claims.role,
            tenant_id: claims.tenant_id,
            exp: claims.exp,
        });

    Ok(next.run(request).await)
}