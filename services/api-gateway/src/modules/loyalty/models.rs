use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoyaltyConfig {
    pub id: String,
    pub tenant_id: String,
    pub points_per_dollar: i32,
    pub redemption_rate: i32,
    pub max_points_per_transaction: i32,
    pub points_expiry_days: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateLoyaltyConfigRequest {
    pub points_per_dollar: Option<i32>,
    pub redemption_rate: Option<i32>,
    pub max_points_per_transaction: Option<i32>,
    pub points_expiry_days: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoyaltyTransaction {
    pub id: String,
    pub tenant_id: String,
    pub customer_email: String,
    pub points_earned: i32,
    pub points_redeemed: i32,
    pub transaction_type: String,
    pub order_id: Option<String>,
    pub balance: i32,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoyaltyBalanceResponse {
    pub customer_email: String,
    pub balance: i32,
    pub total_earned: i32,
    pub total_redeemed: i32,
    pub transactions: Vec<LoyaltyTransaction>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EarnPointsRequest {
    pub customer_email: String,
    pub order_id: String,
    pub amount: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RedeemPointsRequest {
    pub customer_email: String,
    pub points: i32,
}