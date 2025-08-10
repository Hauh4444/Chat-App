use actix_web::web;
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use mongodb::Database;
use redis::aio::ConnectionManager;
use redis::AsyncCommands;

use crate::auth::models::{ User, Session };
use crate::auth::errors::{ DatabaseError, RedisError };

pub async fn fetch_user_by_session(session: &Session, db: &Database) -> Result<User, DatabaseError> {
    let id = ObjectId::parse_str(&session.user_id).map_err(|_| DatabaseError::NotFound)?;
    let collection = db.collection::<User>("users");
    let filter = doc! { "_id": id };
    match collection.find_one(filter).await? {
        Some(user) => Ok(user),
        None => Err(DatabaseError::NotFound),
    }
}

pub async fn fetch_user_by_username(username: &str, db: &Database) -> Result<User, DatabaseError> {
    let collection = db.collection::<User>("users");
    let filter = doc! { "username": username };
    match collection.find_one(filter).await? {
        Some(user) => Ok(user),
        None => Err(DatabaseError::NotFound),
    }
}

pub async fn fetch_session_by_token(token: &str, redis: &web::Data<ConnectionManager>) -> Result<Session, RedisError> {
    let key = format!("session:{}", token);
    let mut conn = redis.get_ref().clone();
    conn.get::<_, Option<String>>(key.as_str())
        .await
        .map_err(RedisError::Redis)?
        .ok_or(RedisError::NotFound)
        .and_then(|json| serde_json::from_str::<Session>(&json).map_err(RedisError::Serde))
}

pub async fn create_session(session: &Session, redis: &web::Data<ConnectionManager>) -> Result<(), RedisError> {
    let json_str = serde_json::to_string(session)?;
    let key = format!("session:{}", session.token);
    let mut conn = redis.get_ref().clone();
    conn.set_ex::<String, &str, ()>(key, &json_str, 86400)
        .await
        .map_err(RedisError::Redis)
}