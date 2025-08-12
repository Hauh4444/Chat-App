use serde::{ Serialize, Deserialize };
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct Chat {
    pub _id: ObjectId,
    pub title: String,
    pub participants: [String; 2],
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Friend {
    pub _id: ObjectId,
    pub participants: [FriendData; 2],
}

#[derive(Serialize, Deserialize)]
pub struct FriendData {
    pub username: String,
    pub logo: String,
}