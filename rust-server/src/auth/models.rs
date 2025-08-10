use serde::{ Serialize, Deserialize };
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub _id: ObjectId,
    pub username: String,
    pub hashed_password: String,
}

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub username: String,
}

#[derive(Serialize, Deserialize)]
pub struct AuthData {
    pub username: String,
    pub hashed_password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Session {
    pub user_id: String,
    pub token: String,
}