use mongodb::bson::doc;
use mongodb::Database;
use futures::StreamExt;

use crate::user::models::{ Chat, Friend };
use crate::errors::DatabaseError;

// TODO Chats need logo
pub async fn fetch_chats_by_username(username: &str, db: &Database) -> Result<Vec<Chat>, DatabaseError> {
    let collection = db.collection::<Chat>("chats");
    let filter = doc! { "participants": username };
    let mut cursor = collection.find(filter).await.map_err(DatabaseError::Mongo)?;
    let mut chats = Vec::new();
    while let Some(result) = cursor.next().await {
        let chat = result.map_err(DatabaseError::Mongo)?;
        chats.push(chat);
    }
    if chats.is_empty() {
        Err(DatabaseError::NotFound)
    } else {
        Ok(chats)
    }
}

// TODO Friends need user logos
pub async fn fetch_friends_by_username(username: &str, db: &Database) -> Result<Vec<Friend>, DatabaseError> {
    let collection = db.collection::<Friend>("friends");
    let filter = doc! { "participants.username": username };
    let mut cursor = collection.find(filter).await.map_err(DatabaseError::Mongo)?;
    let mut friends = Vec::new();
    while let Some(result) = cursor.next().await {
        let friend = result.map_err(DatabaseError::Mongo)?;
        friends.push(friend);
    }
    if friends.is_empty() {
        Err(DatabaseError::NotFound)
    } else {
        Ok(friends)
    }
}