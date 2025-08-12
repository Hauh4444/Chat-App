use actix_web::{ web, Responder, HttpRequest, HttpResponse };
use mongodb::Database;
use redis::aio::ConnectionManager;

use crate::auth::services::validate_session;
use crate::user::mappers::{ fetch_chats_by_username, fetch_friends_by_username };
use crate::errors::DatabaseError;

pub async fn fetch_user_chats(req: HttpRequest, db: web::Data<Database>, redis: web::Data<ConnectionManager>) -> impl Responder {
    let session = match validate_session(&req, &redis).await {
        Ok(session) => session,
        Err(response) => return response,
    };
    match fetch_chats_by_username(&session.username, &db).await {
        Ok(chats) => HttpResponse::Ok().json(chats),
        Err(DatabaseError::NotFound) => {
            return HttpResponse::NotFound().body("Chats not found");
        },
        Err(DatabaseError::Mongo(e)) => {
            eprintln!("Database error while fetching chats: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    }
}

pub async fn fetch_user_friends(req: HttpRequest, db: web::Data<Database>, redis: web::Data<ConnectionManager>) -> impl Responder {
    let session = match validate_session(&req, &redis).await {
        Ok(session) => session,
        Err(response) => return response,
    };
    match fetch_friends_by_username(&session.username, &db).await {
        Ok(friends) => HttpResponse::Ok().json(friends),
        Err(DatabaseError::NotFound) => {
            return HttpResponse::NotFound().body("Friends not found");
        },
        Err(DatabaseError::Mongo(e)) => {
            eprintln!("Database error while fetching friends: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    }
}

pub fn configure_user_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .route("/user/chats/", web::get().to(fetch_user_chats))
        .route("/user/friends/", web::get().to(fetch_user_friends));
}