use serde::{ Serialize, Deserialize };
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct Profile {
    pub _id: ObjectId,
    pub user_id: ObjectId,
    pub username: String,
}

#[derive(Serialize, Deserialize)]
pub struct ProfileData {
    pub user_id: ObjectId,
    pub username: String,
}