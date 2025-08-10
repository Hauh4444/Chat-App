use actix_cors::Cors;
use actix_files::Files;
use actix_web::{App, HttpServer, web, http::header, middleware::Logger};
use dotenv::dotenv;
use std::env;
use env_logger::Env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in the .env file");

    let pool = SqlitePoolOptions::new()
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&env::var("FRONTEND_URL").expect("FRONTEND_URL must be set"))
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![header::CONTENT_TYPE, header::ACCEPT])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(Logger::new(r#"%a "%r" %s"#))
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            .service(
                web::scope("/api")
                    .configure(configure_routes)
            )
            .service(Files::new("/static", "static").show_files_listing())
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}