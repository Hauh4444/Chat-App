use actix_web::{web, Responder, HttpRequest, HttpResponse, cookie};

pub async fn check_auth_status(
    req: HttpRequest,
    pool: web::Data<SqlitePool>,
) -> impl Responder {

}

pub fn configure_auth_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .route("/check_auth_status/", web::get().to(check_auth_status))
}