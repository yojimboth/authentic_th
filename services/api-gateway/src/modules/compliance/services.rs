use crate::db::AppState;
use crate::error::AppError;
use crate::modules::compliance::models::*;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn log_action(
    pool: &PgPool,
    req: &AuditLogRequest,
) -> Result<AuditLog, AppError> {
    let log_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    let now_clone = now.clone();

    let log = AuditLog {
        id: log_id.clone(),
        tenant_id: String::new(),
        user_id: String::new(),
        action: req.action.clone(),
        resource_type: req.resource_type.clone(),
        resource_id: req.resource_id.clone(),
        details: req.details.clone(),
        ip_address: None,
        created_at: now_clone,
    };

    sqlx::query(
        "INSERT INTO audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, details, ip_address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    )
    .bind(&log_id)
    .bind("")
    .bind("")
    .bind(&req.action)
    .bind(&req.resource_type)
    .bind(&req.resource_id)
    .bind(&req.details)
    .bind("")
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(log)
}

pub async fn list_audit_logs(
    pool: &PgPool,
    _tenant_id: &Option<String>,
    _user_id: &Option<String>,
    offset: i64,
    limit: i64,
) -> Result<AuditLogListResponse, AppError> {
    let logs = sqlx::query_as::<_, (String, String, String, String, String, Option<String>, Option<String>, Option<String>, String)>(
        "SELECT id, tenant_id, user_id, action, resource_type, resource_id, details, ip_address, created_at FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM audit_logs")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

    let audit_logs: Vec<AuditLog> = logs.into_iter().map(|(id, tenant_id, user_id, action, resource_type, resource_id, details, ip_address, created_at)| {
        AuditLog {
            id,
            tenant_id,
            user_id,
            action,
            resource_type,
            resource_id,
            details,
            ip_address,
            created_at,
        }
    }).collect();

    Ok(AuditLogListResponse {
        logs: audit_logs,
        total: count.0,
    })
}

pub async fn search_pii(
    _pool: &PgPool,
    _tenant_id: &str,
    _user_id: &str,
) -> Result<PiiResponse, AppError> {
    let records = vec![];

    Ok(PiiResponse {
        found: false,
        records,
    })
}

pub async fn record_consent(
    pool: &PgPool,
    req: &ConsentRequest,
) -> Result<ConsentResponse, AppError> {
    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, details, ip_address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    )
    .bind(Uuid::new_v4().to_string())
    .bind(&req.tenant_id)
    .bind(&req.user_id)
    .bind("consent_recorded")
    .bind("consent")
    .bind(Some(&req.user_id))
    .bind(Some(&req.purpose))
    .bind("")
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(ConsentResponse {
        user_id: req.user_id.clone(),
        consent_given: req.consent_given,
        purpose: req.purpose.clone(),
        recorded_at: now,
    })
}