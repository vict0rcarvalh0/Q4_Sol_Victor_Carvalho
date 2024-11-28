use sqlx::{Pool, Postgres};

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> Result<DbPool, sqlx::Error> {
    let pool = Pool::<Postgres>::connect(&std::env::var("DATABASE_URL").unwrap()).await?;
    sqlx::migrate!("./migrations").run(&pool).await?;
    Ok(pool)
}
