use mongodb::bson::doc;
use mongodb::Database;

use crate::profile::models::{ Profile, ProfileData };
use crate::errors::DatabaseError;

pub async fn fetch_profile_by_username(username: &str, db: &Database) -> Result<Profile, DatabaseError> {
    let collection = db.collection::<Profile>("profiles");
    let document = doc! { "username": username };
    match collection.find_one(document).await? {
        Some(profile) => Ok(profile),
        None => Err(DatabaseError::NotFound),
    }
}

pub async fn create_profile(profile_data: &ProfileData, db: &Database) -> Result<(), DatabaseError> {
    let collection = db.collection::<ProfileData>("profiles");
    collection.insert_one(profile_data).await.map(|_| ()).map_err(DatabaseError::Mongo)
}