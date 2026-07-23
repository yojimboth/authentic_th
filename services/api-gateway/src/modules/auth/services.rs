use crate::db::AppState;
use crate::error::AppError;
use crate::modules::auth::models::{
    LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateTokenRequest,
    ValidateTokenResponse,
};
use crate::types::roles::Role;
use crate::types::status::AccountStatus;
use anyhow::Result;
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub tenant_id: Option<String>,
    pub exp: usize,
}

const JWT_SECRET: &str = "your-secret-key-change-in-production";
const TOKEN_EXPIRY_SECONDS: usize = 86400;

pub async fn hash_password(password: &str) -> Result<String, AppError> {
    hash(password, DEFAULT_COST).map_err(|e| AppError::Internal(e.to_string()))
}

pub async fn verify_password(password: &str, hashed: &str) -> Result<bool, AppError> {
    verify(password, hashed)
        .map_err(|e| AppError::Internal(e.to_string()))
}

pub fn generate_token(user_id: &str, role: &Role, tenant_id: Option<&str>) -> Result<String, AppError> {
    let claims = Claims {
        sub: user_id.to_string(),
        role: role.to_string(),
        tenant_id: tenant_id.map(|s| s.to_string()),
        exp: (chrono::Utc::now().timestamp() + TOKEN_EXPIRY_SECONDS as i64) as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET.as_ref()),
    )
    .map_err(|e| AppError::Internal(e.to_string()))
}

pub fn validate_token(token: &str) -> Result<Claims, AppError> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_ref()),
        &Validation::default(),
    )
    .map_err(|e| AppError::Unauthorized(e.to_string()))?;

    Ok(token_data.claims)
}

pub async fn register_user(
    pool: &PgPool,
    req: &RegisterRequest,
) -> Result<RegisterResponse, AppError> {
    let hashed_password = hash_password(&req.password).await?;
    let user_id = Uuid::new_v4().to_string();

    sqlx::query(
        "INSERT INTO users (id, email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)",
    )
    .bind(&user_id)
    .bind(&req.email)
    .bind(&hashed_password)
    .bind(&req.first_name)
    .bind(&req.last_name)
    .bind(Role::Founder.to_string())
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(RegisterResponse {
        user_id,
        email: req.email.clone(),
        message: "User registered successfully".to_string(),
    })
}

pub async fn login_user(
    pool: &PgPool,
    req: &LoginRequest,
) -> Result<LoginResponse, AppError> {
    let user = sqlx::query_as::<_, (String, String, String, Option<String>, String)>(
        "SELECT id, email, password_hash, tenant_id, role FROM users WHERE email = $1",
    )
    .bind(&req.email)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    let (user_id, email, password_hash, tenant_id, role) = match user {
        Some(u) => u,
        None => return Err(AppError::Unauthorized("Invalid credentials".to_string())),
    };

    let is_valid = verify_password(&req.password, &password_hash).await?;
    if !is_valid {
        return Err(AppError::Unauthorized("Invalid credentials".to_string()));
    }

    let role: Role = role.parse().map_err(|_| AppError::Unauthorized("Invalid role".to_string()))?;
    let token = generate_token(&user_id, &role, tenant_id.as_deref())?;

    Ok(LoginResponse {
        access_token: token,
        token_type: "bearer".to_string(),
        user_id,
        tenant_id,
    })
}

pub async fn validate_token_request(
    _pool: &PgPool,
    req: &ValidateTokenRequest,
) -> Result<ValidateTokenResponse, AppError> {
    let claims = validate_token(&req.token)?;
    Ok(ValidateTokenResponse {
        valid: true,
        user_id: Some(claims.sub),
        role: Some(claims.role),
        tenant_id: claims.tenant_id,
    })
}