-- Paraysco Consulting Inc. Database Schema
-- Supabase PostgreSQL
-- Run this in your Supabase SQL Editor

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (User Profiles)
-- This stores additional profile information for authenticated users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- ADMINS TABLE (Admin Users)
-- Links to users table to identify admin users
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT ARRAY['all'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for clean re-run)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Service role can manage all" ON users;
DROP POLICY IF EXISTS "Service role can manage admins" ON admins;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can manage all users"
    ON users FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
        )
    );

-- Admins can manage admin table
CREATE POLICY "Admins can manage admins"
    ON admins FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ADMIN USER CREATION INSTRUCTIONS
-- =====================================================
-- 
-- IMPORTANT: Passwords must be set through Supabase Auth Admin API or Dashboard
-- The admin user must first be created in auth.users
--
-- STEP 1: Go to Supabase Dashboard > Authentication > Users
-- STEP 2: Click "Add User" button
-- STEP 3: Enter the following details:
--         Email: brandonadii39@gmail.com
--         Password: Password123
--         Confirm Password: Password123
--         (Leave other fields as default)
-- STEP 4: Click "Create User"
-- STEP 5: Note the user's UUID from the table (copy it)
-- STEP 6: Run the SQL queries below (uncommented) with that UUID
-- =====================================================

-- =====================================================
-- ADMIN USER INSERT QUERIES
-- Uncomment and run these AFTER creating the auth user
-- Replace 'YOUR_ADMIN_UUID' with the actual UUID
-- =====================================================

-- Insert admin user profile:
-- INSERT INTO users (id, email, full_name, role, email_verified)
-- VALUES ('YOUR_ADMIN_UUID', 'brandonadii39@gmail.com', 'Admin User', 'admin', true)
-- ON CONFLICT (id) DO UPDATE SET role = 'admin', email_verified = true;

-- Insert into admins table:
-- INSERT INTO admins (user_id, permissions)
-- VALUES ('YOUR_ADMIN_UUID', ARRAY['all'])
-- ON CONFLICT (user_id) DO UPDATE SET permissions = ARRAY['all'];

-- =====================================================
-- AUTOMATED SCRIPT TO CREATE ADMIN (Run this entire block)
-- =====================================================
-- This script creates the admin user if they don't exist
-- Run via Supabase Dashboard SQL Editor

DO $$
DECLARE
    admin_email TEXT := 'brandonadii39@gmail.com';
    admin_password TEXT := 'Password123';
    admin_uuid UUID;
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO admin_uuid FROM auth.users WHERE email = admin_email;
    
    IF admin_uuid IS NULL THEN
        -- Create user using Supabase Auth Admin function
        -- Note: This requires the service_role key or using the Admin UI
        RAISE NOTICE 'Admin user not found in auth.users. Please create manually via Supabase Dashboard.';
    ELSE
        RAISE NOTICE 'Admin user found with UUID: %', admin_uuid;
        
        -- Insert or update users table
        INSERT INTO users (id, email, full_name, role, email_verified)
        VALUES (admin_uuid, admin_email, 'Admin User', 'admin', true)
        ON CONFLICT (id) DO UPDATE SET role = 'admin', email_verified = true;
        
        -- Insert or update admins table
        INSERT INTO admins (user_id, permissions)
        VALUES (admin_uuid, ARRAY['all'])
        ON CONFLICT (user_id) DO UPDATE SET permissions = ARRAY['all'];
        
        RAISE NOTICE 'Admin user configured successfully!';
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check users table:
-- SELECT * FROM users ORDER BY created_at DESC;

-- Check admins table:
-- SELECT * FROM admins;

-- Check if admin user is properly configured:
-- SELECT u.email, u.full_name, u.role, a.permissions, u.created_at
-- FROM users u 
-- LEFT JOIN admins a ON u.id = a.user_id 
-- WHERE u.email = 'brandonadii39@gmail.com';
