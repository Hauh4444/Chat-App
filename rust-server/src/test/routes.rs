use actix_web::{web, Responder, HttpResponse};

pub async fn test() -> impl Responder {
    HttpResponse::Ok().body("Success")
}

pub fn configure_test_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .route("/test/", web::get().to(test));
}