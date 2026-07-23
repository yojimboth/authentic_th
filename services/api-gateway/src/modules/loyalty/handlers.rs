use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
    response::IntoResponse,
};
use serde_json::json;

use crate::db::AppState;
use crate::error::AppError;
use crate::modules::loyalty::models::*;
use crate::modules::loyalty::services;

pub async fn get_loyalty_config(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let config = services::get_loyalty_config(&state.pool, &tenant_id).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": config.id,
            "tenant_id": config.tenant_id,
            "points_per_dollar": config.points_per_dollar,
            "redemption_rate": config.redemption_rate,
            "max_points_per_transaction": config.max_points_per_transaction,
            "points_expiry_days": config.points_expiry_days
        }))
    ))
}

pub async fn create_loyalty_config(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<CreateLoyaltyConfigRequest>,
) -> Result<impl IntoResponse, AppError> {
    let config = services::create_loyalty_config(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "id": config.id,
            "tenant_id": config.tenant_id,
            "message": "Loyalty config created successfully"
        }))
    ))
}

pub async fn earn_points(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<EarnPointsRequest>,
) -> Result<impl IntoResponse, AppError> {
    let transaction = services::earn_points(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": transaction.id,
            "customer_email": transaction.customer_email,
            "points_earned": transaction.points_earned,
            "balance": transaction.balance,
            "message": "Points earned successfully"
        }))
    ))
}

pub async fn redeem_points(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<RedeemPointsRequest>,
) -> Result<impl IntoResponse, AppError> {
    let transaction = services::redeem_points(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": transaction.id,
            "customer_email": transaction.customer_email,
            "points_redeemed": transaction.points_redeemed,
            "balance": transaction.balance,
            "message": "Points redeemed successfully"
        }))
    ))
}

pub async fn get_customer_loyalty(
    State(state): State<AppState>,
    Path((tenant_id, customer_email)): Path<(String, String)>,
) -> Result<impl IntoResponse, AppError> {
    let balance = services::get_customer_loyalty(&state.pool, &tenant_id, &customer_email).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "customer_email": balance.customer_email,
            "balance": balance.balance,
            "total_earned": balance.total_earned,
            "total_redeemed": balance.total_redeemed
        }))
    ))
}