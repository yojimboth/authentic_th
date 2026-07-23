use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TenantStatus {
    Active,
    Inactive,
    Suspended,
    Pending,
}

impl fmt::Display for TenantStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TenantStatus::Active => write!(f, "active"),
            TenantStatus::Inactive => write!(f, "inactive"),
            TenantStatus::Suspended => write!(f, "suspended"),
            TenantStatus::Pending => write!(f, "pending"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OrderStatus {
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled,
    Refunded,
}

impl fmt::Display for OrderStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OrderStatus::Pending => write!(f, "pending"),
            OrderStatus::Confirmed => write!(f, "confirmed"),
            OrderStatus::InProgress => write!(f, "in_progress"),
            OrderStatus::Completed => write!(f, "completed"),
            OrderStatus::Cancelled => write!(f, "cancelled"),
            OrderStatus::Refunded => write!(f, "refunded"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PaymentStatus {
    Pending,
    Paid,
    Failed,
    Refunded,
    Cancelled,
}

impl fmt::Display for PaymentStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PaymentStatus::Pending => write!(f, "pending"),
            PaymentStatus::Paid => write!(f, "paid"),
            PaymentStatus::Failed => write!(f, "failed"),
            PaymentStatus::Refunded => write!(f, "refunded"),
            PaymentStatus::Cancelled => write!(f, "cancelled"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AccountStatus {
    Active,
    Inactive,
    Suspended,
    PendingVerification,
}

impl fmt::Display for AccountStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AccountStatus::Active => write!(f, "active"),
            AccountStatus::Inactive => write!(f, "inactive"),
            AccountStatus::Suspended => write!(f, "suspended"),
            AccountStatus::PendingVerification => write!(f, "pending_verification"),
        }
    }
}