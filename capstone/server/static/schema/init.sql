-- Create farmers table
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY, -- Auto-incrementing integer
    email TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create consumers table
CREATE TABLE consumers (
    id SERIAL PRIMARY KEY, -- Auto-incrementing integer
    email TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY, -- Auto-incrementing integer
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    unit TEXT NOT NULL,
    total_amount FLOAT NOT NULL,
    price_per_unit FLOAT NOT NULL,
    available_quantity FLOAT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'sold_out', 'inactive')),
    farmer_id INT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE, -- Reference to farmers table
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create product_buyers join table to track buyers for products
CREATE TABLE product_buyers (
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- Use INT for product_id
    consumer_id INT NOT NULL REFERENCES consumers(id) ON DELETE CASCADE, -- Use INT for consumer_id
    PRIMARY KEY (product_id, consumer_id)
);

-- Create transaction_history table
CREATE TABLE transaction_history (
    id SERIAL PRIMARY KEY, -- Auto-incrementing integer
    hash TEXT NOT NULL UNIQUE,
    sender_wallet TEXT NOT NULL,
    receiver_wallet TEXT NOT NULL,
    amount FLOAT NOT NULL,
    product_address INT REFERENCES products(id), -- Use INT for product_address
    type TEXT NOT NULL CHECK (type IN ('deliver', 'purchase', 'refund')),
    created_at TIMESTAMP DEFAULT NOW()
);
