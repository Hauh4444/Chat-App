use actix_cors::Cors;
use actix_files::Files;
use actix_web::{ App, HttpServer, web, http::header, middleware::Logger };
use dotenv::dotenv;
use std::env;
use env_logger::Env;
use mongodb::{Client, options::ClientOptions};
use redis::Client as RedisClient;
use redis::aio::ConnectionManager;

use crate::test::routes::configure_test_routes;
use crate::auth::routes::configure_auth_routes;

mod test;
mod auth;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let mongodb_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client_options = ClientOptions::parse(&mongodb_uri).await.expect("Failed to parse MongoDB URI");
    let client = Client::with_options(client_options).expect("Failed to initialize MongoDB client");
    let db_name = env::var("MONGODB_DB").unwrap_or_else(|_| "myapp".to_string());
    let db = client.database(&db_name);

    let redis_url = env::var("REDIS_URL").expect("REDIS_URL must be set");
    let redis_client = RedisClient::open(redis_url).expect("Failed to create Redis client");
    let redis_con_manager = ConnectionManager::new(redis_client).await.expect("Failed to create Redis connection manager");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(&env::var("FRONTEND_URL").expect("FRONTEND_URL must be set"))
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![header::CONTENT_TYPE, header::ACCEPT])
            .supports_credentials()
            .max_age(86400);

        App::new()
            .app_data(web::Data::new(db.clone()))
            .app_data(web::Data::new(redis_con_manager.clone()))
            .wrap(Logger::new(r#"%a "%r" %s"#))
            .wrap(cors)
            .service(
                web::scope("/api")
                    .configure(configure_test_routes)
                    .configure(configure_auth_routes)
            )
            .service(Files::new("/static", "static").show_files_listing())
    })
        .bind("0.0.0.0:8080")?
        .run()
        .await
}