use sqlx::{query_as, query};
use crate::{db::DbPool, models::transaction::{CreateTransactionHistory, TransactionHistory}};

pub async fn create_transaction(
    pool: &DbPool,
    data: CreateTransactionHistory,
) -> Result<TransactionHistory, sqlx::Error> {
    let transaction = query_as::<_, TransactionHistory>(
        "INSERT INTO transaction_history (hash, sender_wallet, receiver_wallet, amount, product_address, type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *"
    )
    .bind(&data.hash)
    .bind(&data.sender_wallet)
    .bind(&data.receiver_wallet)
    .bind(data.amount)
    .bind(data.product_address)
    .bind(&data.transaction_type)
    .fetch_one(pool)
    .await?;

    Ok(transaction)
}

pub async fn get_transaction(pool: &DbPool, id: i32) -> Result<TransactionHistory, sqlx::Error> {
    let transaction = query_as::<_, TransactionHistory>(
        "SELECT * FROM transaction_history WHERE id = $1"
    )
    .bind(id)
    .fetch_one(pool)
    .await?;

    Ok(transaction)
}

pub async fn update_transaction(
    pool: &DbPool,
    id: i32,
    data: CreateTransactionHistory,
) -> Result<TransactionHistory, sqlx::Error> {
    let transaction = query_as::<_, TransactionHistory>(
        "UPDATE transaction_history
         SET hash = $2, sender_wallet = $3, receiver_wallet = $4, amount = $5, product_address = $6, type = $7
         WHERE id = $1
         RETURNING *"
    )
    .bind(id)
    .bind(&data.hash)
    .bind(&data.sender_wallet)
    .bind(&data.receiver_wallet)
    .bind(data.amount)
    .bind(data.product_address)
    .bind(&data.transaction_type)
    .fetch_one(pool)
    .await?;

    Ok(transaction)
}

pub async fn delete_transaction(pool: &DbPool, id: i32) -> Result<(), sqlx::Error> {
    query("DELETE FROM transaction_history WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}
