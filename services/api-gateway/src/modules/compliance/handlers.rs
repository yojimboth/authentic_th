use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
    response::IntoResponse,
};
use serde::Deserialize;
use serde_json::json;

use crate::db::AppState;
use crate::error::AppError;
use crate::modules::compliance::models::*;
use crate::modules::compliance::services;

#[derive(Deserialize)]
pub struct AuditLogPaginationParams {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub tenant_id: Option<String>,
    pub user_id: Option<String>,
}

pub async fn list_audit_logs(
    State(state): State<AppState>,
    Query(params): Query<AuditLogPaginationParams>,
) -> Result<impl IntoResponse, AppError> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(50);
    let offset = (page - 1) * limit;
    let response = services::list_audit_logs(
        &state.pool,
        &params.tenant_id,
        &params.user_id,
        offset,
        limit,
    ).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "logs": response.logs,
            "total": response.total
        }))
    ))
}

pub async fn log_action(
    State(state): State<AppState>,
    Json(payload): Json<AuditLogRequest>,
) -> Result<impl IntoResponse, AppError> {
    let log = services::log_action(&state.pool, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "id": log.id,
            "action": log.action,
            "resource_type": log.resource_type,
            "message": "Audit log created"
        }))
    ))
}

pub async fn search_pii(
    State(state): State<AppState>,
    Json(payload): Json<PiiRequest>,
) -> Result<impl IntoResponse, AppError> {
    let response = services::search_pii(&state.pool, &payload.tenant_id, &payload.user_id).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "found": response.found,
            "records": response.records
        }))
    ))
}

pub async fn record_consent(
    State(state): State<AppState>,
    Json(payload): Json<ConsentRequest>,
) -> Result<impl IntoResponse, AppError> {
    let consent = services::record_consent(&state.pool, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "user_id": consent.user_id,
            "consent_given": consent.consent_given,
            "purpose": consent.purpose,
            "recorded_at": consent.recorded_at
        }))
    ))
}