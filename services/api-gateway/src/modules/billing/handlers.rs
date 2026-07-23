use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
    response::IntoResponse,
};
use serde_json::json;

use crate::db::AppState;
use crate::error::AppError;
use crate::modules::billing::models::*;
use crate::modules::billing::services;

pub async fn get_billing_config(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let config = services::get_billing_config(&state.pool, &tenant_id).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": config.id,
            "tenant_id": config.tenant_id,
            "billing_email": config.billing_email,
            "currency": config.currency,
            "auto_charge_enabled": config.auto_charge_enabled,
            "payment_method": config.payment_method
        }))
    ))
}

pub async fn create_billing_config(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<CreateBillingConfigRequest>,
) -> Result<impl IntoResponse, AppError> {
    let config = services::create_billing_config(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "id": config.id,
            "tenant_id": config.tenant_id,
            "message": "Billing config created successfully"
        }))
    ))
}

pub async fn update_billing_config(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<UpdateBillingConfigRequest>,
) -> Result<impl IntoResponse, AppError> {
    let config = services::update_billing_config(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": config.id,
            "tenant_id": config.tenant_id,
            "message": "Billing config updated successfully"
        }))
    ))
}

pub async fn create_payment_intent(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<PaymentIntentRequest>,
) -> Result<impl IntoResponse, AppError> {
    let intent = services::create_payment_intent(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.payment_intent_id,
            "amount": intent.amount,
            "status": intent.status
        }))
    ))
}