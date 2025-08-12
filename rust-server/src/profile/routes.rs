use actix_web::{ web, Responder, HttpRequest, HttpResponse };
use mongodb::Database;
use redis::aio::ConnectionManager;

use crate::auth::services::validate_session;
use crate::profile::mappers::fetch_profile_by_username;
use crate::errors::DatabaseError;

pub async fn fetch_profile(req: HttpRequest, db: web::Data<Database>, redis: web::Data<ConnectionManager>) -> impl Responder {
    let session = match validate_session(&req, &redis).await {
        Ok(session) => session,
        Err(response) => return response,
    };
    match fetch_profile_by_username(&session.username, &db).await {
        Ok(profile) => HttpResponse::Ok().json(profile),
        Err(DatabaseError::NotFound) => {
            return HttpResponse::NotFound().body("Profile not found");
        },
        Err(DatabaseError::Mongo(e)) => {
            eprintln!("Database error while fetching profile: {:?}", e);
            return HttpResponse::InternalServerError().body("Internal server error");
        }
    }
}

pub fn configure_profile_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .route("/profile/", web::get().to(fetch_profile));
}