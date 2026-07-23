use axum::{
    extract::State,
    http::StatusCode,
    Json,
    response::IntoResponse,
};
use serde_json::json;

use crate::db::AppState;
use crate::error::AppError;
use crate::modules::auth::models::*;
use crate::modules::auth::services;

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, AppError> {
    let response = services::register_user(&state.pool, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "user_id": response.user_id,
            "email": response.email,
            "message": response.message
        }))
    ))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, AppError> {
    let response = services::login_user(&state.pool, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "access_token": response.access_token,
            "token_type": response.token_type,
            "user_id": response.user_id,
            "tenant_id": response.tenant_id
        }))
    ))
}

pub async fn validate_token(
    State(state): State<AppState>,
    Json(payload): Json<ValidateTokenRequest>,
) -> Result<impl IntoResponse, AppError> {
    let response = services::validate_token_request(&state.pool, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "valid": response.valid,
            "user_id": response.user_id,
            "role": response.role,
            "tenant_id": response.tenant_id
        }))
    ))
}