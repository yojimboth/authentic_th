use crate::db::AppState;
use crate::error::AppError;
use crate::modules::orders::models::*;
use crate::types::status::OrderStatus;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_order(
    pool: &PgPool,
    req: &CreateOrderRequest,
) -> Result<OrderResponse, AppError> {
    let order_id = Uuid::new_v4().to_string();
    let order_number = format!("ORD-{}", Uuid::new_v4().to_string().split('-').next().unwrap_or("0000"));
    let now = chrono::Utc::now().to_rfc3339();

    let total_amount: f64 = req.items.iter().map(|item| item.quantity as f64 * item.unit_price).sum();

    sqlx::query(
        "INSERT INTO orders (id, tenant_id, order_number, customer_name, customer_email, notes, status, total_amount, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    )
    .bind(&order_id)
    .bind(&req.tenant_id)
    .bind(&order_number)
    .bind(&req.customer_name)
    .bind(&req.customer_email)
    .bind(&req.notes)
    .bind(OrderStatus::Pending.to_string())
    .bind(total_amount)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    for item in &req.items {
        let item_id = Uuid::new_v4().to_string();
        sqlx::query(
            "INSERT INTO order_items (id, order_id, description, quantity, unit_price, category)
             VALUES ($1, $2, $3, $4, $5, $6)",
        )
        .bind(&item_id)
        .bind(&order_id)
        .bind(&item.description)
        .bind(item.quantity)
        .bind(item.unit_price)
        .bind(&item.category)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;
    }

    Ok(OrderResponse {
        id: order_id,
        tenant_id: req.tenant_id.clone(),
        order_number,
        customer_name: req.customer_name.clone(),
        status: OrderStatus::Pending.to_string(),
        total_amount,
        created_at: now,
    })
}

pub async fn get_order(
    pool: &PgPool,
    order_id: &str,
) -> Result<OrderResponse, AppError> {
    let result = sqlx::query_as::<_, (String, String, String, String, String, f64, String)>(
        "SELECT id, tenant_id, order_number, customer_name, status, total_amount, created_at FROM orders WHERE id = $1",
    )
    .bind(order_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    match result {
        Some((id, tenant_id, order_number, customer_name, status, total_amount, created_at)) => Ok(OrderResponse {
            id,
            tenant_id,
            order_number,
            customer_name,
            status,
            total_amount,
            created_at,
        }),
        None => Err(AppError::NotFound("Order not found".to_string())),
    }
}

pub async fn list_orders(
    pool: &PgPool,
    tenant_id: &Option<String>,
    status: &Option<String>,
    offset: i64,
    limit: i64,
) -> Result<OrderListResponse, AppError> {
    let orders = if let (Some(tid), Some(st)) = (tenant_id, status) {
        sqlx::query_as::<_, (String, String, String, String, String, f64, String)>(
            "SELECT id, tenant_id, order_number, customer_name, status, total_amount, created_at FROM orders WHERE tenant_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4",
        )
        .bind(tid)
        .bind(st)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?
    } else if let Some(tid) = tenant_id {
        sqlx::query_as::<_, (String, String, String, String, String, f64, String)>(
            "SELECT id, tenant_id, order_number, customer_name, status, total_amount, created_at FROM orders WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
        )
        .bind(tid)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?
    } else {
        sqlx::query_as::<_, (String, String, String, String, String, f64, String)>(
            "SELECT id, tenant_id, order_number, customer_name, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?
    };

    let count: (i64,) = if let Some(tid) = tenant_id {
        sqlx::query_as("SELECT COUNT(*) FROM orders WHERE tenant_id = $1")
            .bind(tid)
            .fetch_one(pool)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
    } else {
        sqlx::query_as("SELECT COUNT(*) FROM orders")
            .fetch_one(pool)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
    };

    let order_responses = orders
        .into_iter()
        .map(|(id, tenant_id, order_number, customer_name, status, total_amount, created_at)| {
            OrderResponse {
                id,
                tenant_id,
                order_number,
                customer_name,
                status,
                total_amount,
                created_at,
            }
        })
        .collect();

    Ok(OrderListResponse {
        orders: order_responses,
        total: count.0,
    })
}

pub async fn update_order_status(
    pool: &PgPool,
    order_id: &str,
    status: &str,
) -> Result<OrderResponse, AppError> {
    let order = get_order(pool, order_id).await?;

    sqlx::query("UPDATE orders SET status = $1 WHERE id = $2")
        .bind(status)
        .bind(order_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(OrderResponse {
        id: order.id,
        tenant_id: order.tenant_id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        status: status.to_string(),
        total_amount: order.total_amount,
        created_at: order.created_at,
    })
}