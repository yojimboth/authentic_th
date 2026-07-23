use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BillingConfig {
    pub id: String,
    pub tenant_id: String,
    pub stripe_customer_id: Option<String>,
    pub billing_email: Option<String>,
    pub currency: String,
    pub auto_charge_enabled: bool,
    pub payment_method: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateBillingConfigRequest {
    pub billing_email: Option<String>,
    pub currency: Option<String>,
    pub auto_charge_enabled: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateBillingConfigRequest {
    pub billing_email: Option<String>,
    pub currency: Option<String>,
    pub auto_charge_enabled: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentIntentRequest {
    pub amount: f64,
    pub currency: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentIntentResponse {
    pub client_secret: String,
    pub payment_intent_id: String,
    pub amount: f64,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BillingHistoryResponse {
    pub payments: Vec<PaymentRecord>,
    pub total: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PaymentRecord {
    pub id: String,
    pub amount: f64,
    pub currency: String,
    pub status: String,
    pub created_at: String,
}