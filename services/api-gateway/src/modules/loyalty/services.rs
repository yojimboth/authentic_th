use crate::db::AppState;
use crate::error::AppError;
use crate::modules::loyalty::models::*;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_loyalty_config(
    pool: &PgPool,
    tenant_id: &str,
) -> Result<LoyaltyConfig, AppError> {
    let result = sqlx::query_as::<_, (String, String, i32, i32, i32, i32)>(
        "SELECT id, tenant_id, points_per_dollar, redemption_rate, max_points_per_transaction, points_expiry_days FROM loyalty_configs WHERE tenant_id = $1",
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    match result {
        Some((id, tid, points_per_dollar, redemption_rate, max_points, expiry_days)) => Ok(LoyaltyConfig {
            id,
            tenant_id: tid,
            points_per_dollar,
            redemption_rate,
            max_points_per_transaction: max_points,
            points_expiry_days: expiry_days,
        }),
        None => Err(AppError::NotFound("Loyalty config not found".to_string())),
    }
}

pub async fn create_loyalty_config(
    pool: &PgPool,
    tenant_id: &str,
    req: &CreateLoyaltyConfigRequest,
) -> Result<LoyaltyConfig, AppError> {
    let config_id = Uuid::new_v4().to_string();
    let points_per_dollar = req.points_per_dollar.unwrap_or(10);
    let redemption_rate = req.redemption_rate.unwrap_or(100);
    let max_points = req.max_points_per_transaction.unwrap_or(5000);
    let expiry_days = req.points_expiry_days.unwrap_or(365);

    sqlx::query(
        "INSERT INTO loyalty_configs (id, tenant_id, points_per_dollar, redemption_rate, max_points_per_transaction, points_expiry_days)
         VALUES ($1, $2, $3, $4, $5, $6)",
    )
    .bind(&config_id)
    .bind(tenant_id)
    .bind(points_per_dollar)
    .bind(redemption_rate)
    .bind(max_points)
    .bind(expiry_days)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(LoyaltyConfig {
        id: config_id,
        tenant_id: tenant_id.to_string(),
        points_per_dollar,
        redemption_rate,
        max_points_per_transaction: max_points,
        points_expiry_days: expiry_days,
    })
}

pub async fn earn_points(
    pool: &PgPool,
    tenant_id: &str,
    req: &EarnPointsRequest,
) -> Result<LoyaltyTransaction, AppError> {
    let config = get_loyalty_config(pool, tenant_id).await?;
    let points = ((req.amount * config.points_per_dollar as f64) as i32).min(config.max_points_per_transaction);

    let transaction_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO loyalty_transactions (id, tenant_id, customer_email, points_earned, points_redeemed, transaction_type, order_id, balance, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    )
    .bind(&transaction_id)
    .bind(tenant_id)
    .bind(&req.customer_email)
    .bind(points)
    .bind(0)
    .bind("earn")
    .bind(Some(&req.order_id))
    .bind(points)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(LoyaltyTransaction {
        id: transaction_id,
        tenant_id: tenant_id.to_string(),
        customer_email: req.customer_email.clone(),
        points_earned: points,
        points_redeemed: 0,
        transaction_type: "earn".to_string(),
        order_id: Some(req.order_id.clone()),
        balance: points,
        created_at: now,
    })
}

pub async fn redeem_points(
    pool: &PgPool,
    tenant_id: &str,
    req: &RedeemPointsRequest,
) -> Result<LoyaltyTransaction, AppError> {
    let config = get_loyalty_config(pool, tenant_id).await?;

    let transaction_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO loyalty_transactions (id, tenant_id, customer_email, points_earned, points_redeemed, transaction_type, order_id, balance, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    )
    .bind(&transaction_id)
    .bind(tenant_id)
    .bind(&req.customer_email)
    .bind(0)
    .bind(req.points)
    .bind("redeem")
    .bind(None::<String>)
    .bind(-req.points)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(LoyaltyTransaction {
        id: transaction_id,
        tenant_id: tenant_id.to_string(),
        customer_email: req.customer_email.clone(),
        points_earned: 0,
        points_redeemed: req.points,
        transaction_type: "redeem".to_string(),
        order_id: None,
        balance: -req.points,
        created_at: now,
    })
}

pub async fn get_customer_loyalty(
    pool: &PgPool,
    tenant_id: &str,
    customer_email: &str,
) -> Result<LoyaltyBalanceResponse, AppError> {
    let transactions = sqlx::query_as::<_, (String, String, String, i32, i32, String, Option<String>, i32, String)>(
        "SELECT id, tenant_id, customer_email, points_earned, points_redeemed, transaction_type, order_id, balance, created_at FROM loyalty_transactions WHERE tenant_id = $1 AND customer_email = $2 ORDER BY created_at DESC",
    )
    .bind(tenant_id)
    .bind(customer_email)
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    let loyalty_transactions: Vec<LoyaltyTransaction> = transactions.into_iter().map(|(id, tid, ce, pe, pr, tt, oid, bal, ca)| {
        LoyaltyTransaction {
            id,
            tenant_id: tid,
            customer_email: ce,
            points_earned: pe,
            points_redeemed: pr,
            transaction_type: tt,
            order_id: oid,
            balance: bal,
            created_at: ca,
        }
    }).collect();

    let total_earned: i32 = loyalty_transactions.iter().map(|t| t.points_earned).sum();
    let total_redeemed: i32 = loyalty_transactions.iter().map(|t| t.points_redeemed).sum();
    let balance = total_earned - total_redeemed;

    Ok(LoyaltyBalanceResponse {
        customer_email: customer_email.to_string(),
        balance,
        total_earned,
        total_redeemed,
        transactions: loyalty_transactions,
    })
}