use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLog {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<String>,
    pub details: Option<String>,
    pub ip_address: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLogRequest {
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<String>,
    pub details: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLogListResponse {
    pub logs: Vec<AuditLog>,
    pub total: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PiiRequest {
    pub tenant_id: String,
    pub user_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PiiResponse {
    pub found: bool,
    pub records: Vec<PiiRecord>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PiiRecord {
    pub table: String,
    pub record_id: String,
    pub fields: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConsentRequest {
    pub tenant_id: String,
    pub user_id: String,
    pub consent_given: bool,
    pub purpose: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConsentResponse {
    pub user_id: String,
    pub consent_given: bool,
    pub purpose: String,
    pub recorded_at: String,
}