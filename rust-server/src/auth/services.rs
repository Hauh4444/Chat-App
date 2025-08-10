use actix_web::{ web, HttpRequest, HttpResponse };
use redis::aio::ConnectionManager;
use base64::{ engine::general_purpose::URL_SAFE_NO_PAD, Engine as _ };
use rand::RngCore;

use crate::auth::mappers::fetch_session_by_token;
use crate::auth::models::Session;

pub async fn validate_session(req: &HttpRequest, redis: &web::Data<ConnectionManager>) -> Result<Session, HttpResponse> {
    let header_value = req.headers().get("Authorization")
        .ok_or_else(|| HttpResponse::Unauthorized().body("Authorization header missing"))?;
    let auth_str = header_value.to_str()
        .map_err(|_| HttpResponse::Unauthorized().body("Invalid authorization header"))?;
    let token = auth_str.strip_prefix("Bearer ")
        .ok_or_else(|| HttpResponse::Unauthorized().body("No bearer token found"))?.to_string();
    fetch_session_by_token(&token, redis).await
        .map_err(|e| HttpResponse::Unauthorized().body(format!("Session not authenticated: {}", e)))
}

pub fn generate_session_token() -> String {
    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    URL_SAFE_NO_PAD.encode(&bytes)
}