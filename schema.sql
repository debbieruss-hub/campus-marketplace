-- Enable PostgreSQL UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing tables during re-initialization
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table with Role-Based Access Control (RBAC) & Email Domain Guard
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_alu_email CHECK (email LIKE '%@alustudent.com')
);

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Categories
INSERT INTO categories (name, slug) VALUES
('Electronics', 'electronics'),
('Dorm Essentials', 'dorm-essentials'),
('Kitchenware', 'kitchenware'),
('Fashion', 'fashion'),
('Study Accessories', 'study-accessories'),
('Gadgets', 'gadgets');

-- 3. Items Table with UUIDs & Soft Deletes
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price_mur NUMERIC(10, 2) NOT NULL CHECK (price_mur >= 0),
    item_condition VARCHAR(20) NOT NULL CHECK (item_condition IN ('New', 'Like New', 'Good', 'Fair')),
    image_url TEXT NOT NULL,
    campus_location VARCHAR(100) NOT NULL DEFAULT 'Beau Plan' CHECK (campus_location IN ('Beau Plan', 'Pamplemousses', 'Grand Baie')),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Sold')),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for Search & Filter queries
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_items_active ON items(is_deleted, status);
CREATE INDEX idx_items_price ON items(price_mur);