use crate::db::AppState;
use crate::error::AppError;
use crate::modules::tenants::models::*;
use crate::types::status::TenantStatus;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_tenant(
    pool: &PgPool,
    req: &CreateTenantRequest,
) -> Result<TenantResponse, AppError> {
    let tenant_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    sqlx::query(
        "INSERT INTO tenants (id, name, company_name, company_id_slug, contact_email, contact_phone, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    )
    .bind(&tenant_id)
    .bind(&req.name)
    .bind(&req.company_name)
    .bind(&req.company_id_slug)
    .bind(&req.contact_email)
    .bind(&req.contact_phone)
    .bind(TenantStatus::Active.to_string())
    .bind(&now)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(TenantResponse {
        id: tenant_id,
        name: req.name.clone(),
        company_name: req.company_name.clone(),
        company_id_slug: req.company_id_slug.clone(),
        status: TenantStatus::Active.to_string(),
        created_at: now,
    })
}

pub async fn get_tenant(
    pool: &PgPool,
    tenant_id: &str,
) -> Result<TenantResponse, AppError> {
    let result = sqlx::query_as::<_, (String, String, String, String, String, String)>(
        "SELECT id, name, company_name, company_id_slug, status, created_at FROM tenants WHERE id = $1",
    )
    .bind(tenant_id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    match result {
        Some((id, name, company_name, company_id_slug, status, created_at)) => Ok(TenantResponse {
            id,
            name,
            company_name,
            company_id_slug,
            status,
            created_at,
        }),
        None => Err(AppError::NotFound("Tenant not found".to_string())),
    }
}

pub async fn list_tenants(
    pool: &PgPool,
    offset: i64,
    limit: i64,
) -> Result<TenantListResponse, AppError> {
    let tenants = sqlx::query_as::<_, (String, String, String, String, String, String)>(
        "SELECT id, name, company_name, company_id_slug, status, created_at FROM tenants ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM tenants")
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Database(e.to_string()))?;

    let tenant_responses = tenants
        .into_iter()
        .map(|(id, name, company_name, company_id_slug, status, created_at)| TenantResponse {
            id,
            name,
            company_name,
            company_id_slug,
            status,
            created_at,
        })
        .collect();

    Ok(TenantListResponse {
        tenants: tenant_responses,
        total: count.0,
    })
}

pub async fn update_tenant(
    pool: &PgPool,
    tenant_id: &str,
    req: &UpdateTenantRequest,
) -> Result<TenantResponse, AppError> {
    let existing = get_tenant(pool, tenant_id).await?;

    let name = req.name.as_deref().unwrap_or(&existing.name);
    let company_name = req.company_name.as_deref().unwrap_or(&existing.company_name);

    sqlx::query(
        "UPDATE tenants SET name = $1, company_name = $2 WHERE id = $3",
    )
    .bind(name)
    .bind(company_name)
    .bind(tenant_id)
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(TenantResponse {
        id: tenant_id.to_string(),
        name: name.to_string(),
        company_name: company_name.to_string(),
        company_id_slug: existing.company_id_slug,
        status: existing.status,
        created_at: existing.created_at,
    })
}