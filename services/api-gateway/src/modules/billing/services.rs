use crate::db::AppState;
use crate::error::AppError;
use crate::modules::billing::models::*;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_billing_config(
    pool: &PgPool,
    tenant_id: &str,
) -> Result<BillingConfig, AppError> {
    let result = sqlx::query_as::<_, (String, String, Option<String>, Option<String>, String, bool, String)>(
        "SELECT id, tenant_id, stripe_customer_id, billing_email, currency, auto_charge_enabled, payment_method FROM billing_configs WHERE tenant_id = $1",
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    match result {
        Some((id, tid, stripe_customer_id, billing_email, currency, auto_charge_enabled, payment_method)) => Ok(BillingConfig {
            id,
            tenant_id: tid,
            stripe_customer_id,
            billing_email,
            currency,
            auto_charge_enabled,
            payment_method,
        }),
        None => Err(AppError::NotFound("Billing config not found".to_string())),
    }
}

pub async fn create_billing_config(
    pool: &PgPool,
    tenant_id: &str,
    req: &CreateBillingConfigRequest,
) -> Result<BillingConfig, AppError> {
    let config_id = Uuid::new_v4().to_string();
    let currency = req.currency.as_deref().unwrap_or("aud");
    let auto_charge = req.auto_charge_enabled.unwrap_or(false);

    sqlx::query(
        "INSERT INTO billing_configs (id, tenant_id, billing_email, currency, auto_charge_enabled, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6)",
    )
    .bind(&config_id)
    .bind(tenant_id)
    .bind(&req.billing_email)
    .bind(currency)
    .bind(auto_charge)
    .bind("stripe")
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(BillingConfig {
        id: config_id,
        tenant_id: tenant_id.to_string(),
        stripe_customer_id: None,
        billing_email: req.billing_email.clone(),
        currency: currency.to_string(),
        auto_charge_enabled: auto_charge,
        payment_method: "stripe".to_string(),
    })
}

pub async fn update_billing_config(
    pool: &PgPool,
    tenant_id: &str,
    req: &UpdateBillingConfigRequest,
) -> Result<BillingConfig, AppError> {
    let config = get_billing_config(pool, tenant_id).await?;

    let billing_email = req.billing_email.as_deref().unwrap_or(config.billing_email.as_deref().unwrap_or(""));
    let currency = req.currency.as_deref().unwrap_or(&config.currency);
    let auto_charge = req.auto_charge_enabled.unwrap_or(config.auto_charge_enabled);

    sqlx::query(
        "UPDATE billing_configs SET billing_email = $1, currency = $2, auto_charge_enabled = $3 WHERE tenant_id = $4",
    )
    .bind(billing_email)
    .bind(currency)
    .bind(auto_charge)
    .bind(tenant_id)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(BillingConfig {
        id: config.id,
        tenant_id: config.tenant_id,
        stripe_customer_id: config.stripe_customer_id,
        billing_email: if billing_email.is_empty() { None } else { Some(billing_email.to_string()) },
        currency: currency.to_string(),
        auto_charge_enabled: auto_charge,
        payment_method: config.payment_method,
    })
}

pub async fn create_payment_intent(
    pool: &PgPool,
    tenant_id: &str,
    req: &PaymentIntentRequest,
) -> Result<PaymentIntentResponse, AppError> {
    let payment_id = Uuid::new_v4().to_string();
    let client_secret = format!("pi_{}_secret_{}", payment_id, Uuid::new_v4().to_string().split('-').next().unwrap_or("0000"));

    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO payments (id, tenant_id, amount, currency, status, payment_intent_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)",
    )
    .bind(&payment_id)
    .bind(tenant_id)
    .bind(req.amount)
    .bind(&req.currency)
    .bind("pending")
    .bind(&payment_id)
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(PaymentIntentResponse {
        client_secret,
        payment_intent_id: payment_id,
        amount: req.amount,
        status: "pending".to_string(),
    })
}