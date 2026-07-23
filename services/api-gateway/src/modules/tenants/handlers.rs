use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
    response::IntoResponse,
};
use serde::Deserialize;
use serde_json::json;

use crate::db::AppState;
use crate::error::AppError;
use crate::modules::tenants::models::*;
use crate::modules::tenants::services;

#[derive(Deserialize)]
pub struct PaginationParams {
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

pub async fn list_tenants(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<impl IntoResponse, AppError> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20);
    let offset = (page - 1) * limit;
    let response = services::list_tenants(&state.pool, offset, limit).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "tenants": response.tenants,
            "total": response.total
        }))
    ))
}

pub async fn get_tenant(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let tenant = services::get_tenant(&state.pool, &tenant_id).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": tenant.id,
            "name": tenant.name,
            "company_name": tenant.company_name,
            "company_id_slug": tenant.company_id_slug,
            "status": tenant.status,
            "created_at": tenant.created_at
        }))
    ))
}

pub async fn create_tenant(
    State(state): State<AppState>,
    Json(payload): Json<CreateTenantRequest>,
) -> Result<impl IntoResponse, AppError> {
    let tenant = services::create_tenant(&state.pool, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "id": tenant.id,
            "name": tenant.name,
            "company_name": tenant.company_name,
            "message": "Tenant created successfully"
        }))
    ))
}

pub async fn update_tenant(
    State(state): State<AppState>,
    Path(tenant_id): Path<String>,
    Json(payload): Json<UpdateTenantRequest>,
) -> Result<impl IntoResponse, AppError> {
    let tenant = services::update_tenant(&state.pool, &tenant_id, &payload).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": tenant.id,
            "name": tenant.name,
            "company_name": tenant.company_name,
            "message": "Tenant updated successfully"
        }))
    ))
}