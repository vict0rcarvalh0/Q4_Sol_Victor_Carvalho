-- Create farmers table
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);

-- Create consumers table
CREATE TABLE consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    wallet_address TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    unit TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    available_quantity DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'sold_out', 'inactive')),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create product_buyers join table to track buyers for products
CREATE TABLE product_buyers (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, consumer_id)
);

-- Create transaction_history table
CREATE TABLE transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash TEXT NOT NULL UNIQUE,
    sender_wallet TEXT NOT NULL,
    receiver_wallet TEXT NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    product_address UUID REFERENCES products(id),
    type TEXT NOT NULL CHECK (type IN ('deliver', 'purchase', 'refund')),
    created_at TIMESTAMP DEFAULT NOW()
);
