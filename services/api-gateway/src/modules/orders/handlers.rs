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
use crate::modules::orders::models::*;
use crate::modules::orders::services;

#[derive(Deserialize)]
pub struct OrderPaginationParams {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub tenant_id: Option<String>,
    pub status: Option<String>,
}

pub async fn list_orders(
    State(state): State<AppState>,
    Query(params): Query<OrderPaginationParams>,
) -> Result<impl IntoResponse, AppError> {
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(20);
    let offset = (page - 1) * limit;
    let response = services::list_orders(
        &state.pool,
        &params.tenant_id,
        &params.status,
        offset,
        limit,
    ).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "orders": response.orders,
            "total": response.total
        }))
    ))
}

pub async fn get_order(
    State(state): State<AppState>,
    Path(order_id): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let order = services::get_order(&state.pool, &order_id).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": order.id,
            "tenant_id": order.tenant_id,
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at
        }))
    ))
}

pub async fn create_order(
    State(state): State<AppState>,
    Json(payload): Json<CreateOrderRequest>,
) -> Result<impl IntoResponse, AppError> {
    let order = services::create_order(&state.pool, &payload).await?;
    Ok((
        StatusCode::CREATED,
        Json(json!({
            "id": order.id,
            "order_number": order.order_number,
            "tenant_id": order.tenant_id,
            "message": "Order created successfully"
        }))
    ))
}

pub async fn update_order_status(
    State(state): State<AppState>,
    Path(order_id): Path<String>,
    Json(payload): Json<UpdateOrderStatusRequest>,
) -> Result<impl IntoResponse, AppError> {
    let order = services::update_order_status(&state.pool, &order_id, &payload.status).await?;
    Ok((
        StatusCode::OK,
        Json(json!({
            "id": order.id,
            "status": order.status,
            "message": "Order status updated"
        }))
    ))
}