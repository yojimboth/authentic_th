use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateOrderRequest {
    pub tenant_id: String,
    pub customer_name: String,
    pub customer_email: Option<String>,
    pub items: Vec<OrderItemRequest>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderItemRequest {
    pub description: String,
    pub quantity: i32,
    pub unit_price: f64,
    pub category: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderResponse {
    pub id: String,
    pub tenant_id: String,
    pub order_number: String,
    pub customer_name: String,
    pub status: String,
    pub total_amount: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderListResponse {
    pub orders: Vec<OrderResponse>,
    pub total: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdateOrderStatusRequest {
    pub status: String,
}