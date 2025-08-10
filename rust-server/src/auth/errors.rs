use thiserror::Error;
use mongodb::error::Error as MongoError;

#[derive(Debug, Error)]
pub enum DatabaseError {
    #[error("User not found")]
    NotFound,

    #[error(transparent)]
    Mongo(#[from] MongoError),
}

#[derive(Error, Debug)]
pub enum RedisError {
    #[error("Session not found")]
    NotFound,

    #[error(transparent)]
    Redis(#[from] redis::RedisError),

    #[error(transparent)]
    Serde(#[from] serde_json::Error),
}

