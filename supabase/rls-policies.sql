-- =====================================================
-- ADD CURRENCY COLUMN TO TABLES
-- Run this to add currency field to existing tables
-- =====================================================

-- Add currency column to properties table (if not exists)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add currency column to products table (if not exists)
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- =====================================================
-- FIX RLS POLICIES FOR ALL TABLES
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Drop existing products policies
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Create policies for products
CREATE POLICY "Anyone can view active products" ON products
FOR SELECT USING (is_active = TRUE OR EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can manage products" ON products
FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- =====================================================
-- SERVICES TABLE POLICIES
-- =====================================================

-- Drop existing services policies
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;

-- Create policies for services
CREATE POLICY "Anyone can view active services" ON services
FOR SELECT USING (is_active = TRUE OR EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE POLICY "Admins can manage services" ON services
FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check all policies:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;

-- Test if public can read (should return data):
-- SELECT * FROM products LIMIT 1;
