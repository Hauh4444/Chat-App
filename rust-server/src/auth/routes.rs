use actix_web::{ web, Responder, HttpRequest, HttpResponse };
use mongodb::Database;
use redis::aio::ConnectionManager;

use crate::auth::mappers::{ fetch_user_by_session, fetch_user_by_username, create_session };
use crate::auth::models::{ AuthResponse, AuthData, Session };
use crate::auth::services::{ validate_session, generate_session_token };
use crate::auth::errors::{ DatabaseError, RedisError };

pub async fn check_auth_status(req: HttpRequest, db: web::Data<Database>, redis: web::Data<ConnectionManager>) -> impl Responder {
    let session = match validate_session(&req, &redis).await {
        Ok(session) => session,
        Err(response) => return response,
    };
    match fetch_user_by_session(&session, &db).await {
        Ok(user) => HttpResponse::Ok().json(AuthResponse { username: user.username }),
        Err(DatabaseError::NotFound) => {
            return HttpResponse::Unauthorized().body("User not found");
        },
        Err(DatabaseError::Mongo(e)) => {
            eprintln!("Database error while fetching user: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        },
    }
}

pub async fn login(data: web::Json<AuthData>, db: web::Data<Database>, redis: web::Data<ConnectionManager>) -> impl Responder {
    let auth_data = data.into_inner();
    let user = match fetch_user_by_username(&auth_data.username, &db).await {
        Ok(user) => user,
        Err(DatabaseError::NotFound) => {
            return HttpResponse::Unauthorized().body("User not found");
        },
        Err(DatabaseError::Mongo(e)) => {
            eprintln!("Database error while fetching user: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        },
    };
    if &auth_data.hashed_password != &user.hashed_password {
        return HttpResponse::Unauthorized().body(format!("Invalid password"));
    };

    let token = generate_session_token();
    let session = Session { user_id: user._id.to_hex(), token: token.to_string() };
    match create_session(&session, &redis).await {
        Ok(()) => HttpResponse::Ok().insert_header(("x-session-token", token)).body("Session created"),
        Err(RedisError::Redis(e)) => {
            eprintln!("Redis error while creating session: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        },
        Err(RedisError::Serde(e)) => {
            eprintln!("Serialization error while creating session: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        },
        Err(e) => {
            eprintln!("Unexpected error while creating session: {:?}", e);
            return HttpResponse::InternalServerError().body("Unexpected error")
        },
    }
}

pub fn configure_auth_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .route("/check_auth_status/", web::get().to(check_auth_status))
        .route("/login/", web::post().to(login));
}