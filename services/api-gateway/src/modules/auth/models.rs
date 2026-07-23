use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginResponse {
    pub access_token: String,
    pub token_type: String,
    pub user_id: String,
    pub tenant_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ValidateTokenRequest {
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ValidateTokenResponse {
    pub valid: bool,
    pub user_id: Option<String>,
    pub role: Option<String>,
    pub tenant_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RegisterResponse {
    pub user_id: String,
    pub email: String,
    pub message: String,
}