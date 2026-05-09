-- ChainMed Database Schema
-- PostgreSQL (Open Source Database)
-- Flyway Migration V1

-- ============ PRODUCTS TABLE ============
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL UNIQUE,
    manufacturer VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    manufacture_date TIMESTAMP NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'MANUFACTURED',
    blockchain_product_id BIGINT,
    blockchain_tx_hash VARCHAR(66),
    current_holder_address VARCHAR(42),
    description TEXT,
    storage_conditions VARCHAR(255),
    price DECIMAL(10,2),
    quantity INTEGER DEFAULT 0,
    image_url TEXT,
    is_recalled BOOLEAN DEFAULT FALSE,
    recall_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- ============ SUPPLY CHAIN EVENTS TABLE ============
CREATE TABLE IF NOT EXISTS supply_chain_events (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    status VARCHAR(50) NOT NULL,
    actor_address VARCHAR(42),
    actor_name VARCHAR(255),
    location VARCHAR(255),
    notes TEXT,
    blockchain_tx_hash VARCHAR(66),
    blockchain_event_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ ACTORS TABLE ============
CREATE TABLE IF NOT EXISTS actors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ethereum_address VARCHAR(42) UNIQUE,
    role VARCHAR(50) NOT NULL,
    organization VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ USERS TABLE ============
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
    actor_id BIGINT REFERENCES actors(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ============ INDEXES ============
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);
CREATE INDEX idx_products_batch ON products(batch_number);
CREATE INDEX idx_products_blockchain_id ON products(blockchain_product_id);
CREATE INDEX idx_events_product_id ON supply_chain_events(product_id);
CREATE INDEX idx_events_actor ON supply_chain_events(actor_address);

-- ============ SEED DATA ============
INSERT INTO actors (name, ethereum_address, role, organization, email) VALUES
('PharmaCorp', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'MANUFACTURER', 'PharmaCorp Ltd', 'pharma@chainmed.com'),
('MediDist', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'DISTRIBUTOR', 'MediDist Inc', 'dist@chainmed.com'),
('CityPharmacy', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'PHARMACY', 'City Pharmacy Chain', 'pharmacy@chainmed.com'),
('General Hospital', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'HOSPITAL', 'General Hospital NHS', 'hospital@chainmed.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, batch_number, manufacturer, category, manufacture_date, expiry_date, status, description, storage_conditions, price, quantity) VALUES
('Amoxicillin 500mg', 'BATCH-AMX-001', 'PharmaCorp Ltd', 'Antibiotic', '2024-01-15', '2026-01-15', 'AT_PHARMACY', 'Broad-spectrum antibiotic', 'Room temperature 15-25°C', 12.50, 1000),
('Paracetamol 500mg', 'BATCH-PCM-002', 'PharmaCorp Ltd', 'Painkiller', '2024-02-01', '2026-02-01', 'AT_DISTRIBUTOR', 'Pain relief medication', 'Room temperature', 5.00, 5000),
('Insulin Glargine', 'BATCH-INS-003', 'PharmaCorp Ltd', 'Insulin', '2024-03-01', '2025-09-01', 'MANUFACTURED', 'Long-acting insulin', 'Refrigerate 2-8°C', 45.00, 200)
ON CONFLICT DO NOTHING;
