use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateTenantRequest {
    pub name: String,
    pub company_name: String,
    pub company_id_slug: String,
    pub contact_email: String,
    pub contact_phone: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TenantResponse {
    pub id: String,
    pub name: String,
    pub company_name: String,
    pub company_id_slug: String,
    pub status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateTenantRequest {
    pub name: Option<String>,
    pub company_name: Option<String>,
    pub contact_email: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TenantListResponse {
    pub tenants: Vec<TenantResponse>,
    pub total: i64,
}