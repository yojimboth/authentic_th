use axum::{
    extract::Request,
    http::HeaderMap,
    middleware::Next,
    response::Response,
};

use crate::error::AppError;

pub async fn tenant_middleware(
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let tenant_id = headers
        .get("x-tenant-id")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::BadRequest("Missing x-tenant-id header".to_string()))?
        .to_string();

    request.extensions_mut().insert(tenant_id);

    Ok(next.run(request).await)
}