-- Paraysco Consulting Inc. Database Schema
-- Supabase PostgreSQL
-- Run this in your Supabase SQL Editor

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (User Profiles)
-- Note: Password is stored in auth.users, NOT here
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- ADMINS TABLE (Admin Users)
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
-- TEAM MEMBERS TABLE (Team Page Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_sort ON team_members(sort_order);

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- =====================================================
-- PROPERTIES TABLE (Properties Page Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL, -- 'residential', 'commercial', 'land', 'industrial'
    status TEXT DEFAULT 'available', -- 'available', 'sold', 'rented'
    price DECIMAL(15, 2),
    location TEXT NOT NULL,
    address TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqm DECIMAL(10, 2),
    features TEXT[], -- Array of feature strings
    images TEXT[], -- Array of image URLs
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active);

-- =====================================================
-- NEWSLETTERS TABLE (Newsletter Posts/Articles)
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_newsletters_slug ON newsletters(slug);
CREATE INDEX IF NOT EXISTS idx_newsletters_published ON newsletters(is_published);
CREATE INDEX IF NOT EXISTS idx_newsletters_category ON newsletters(category);

-- =====================================================
-- CONSULTANTS TABLE (Consultants Page Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS consultants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultants_active ON consultants(is_active);
CREATE INDEX IF NOT EXISTS idx_consultants_spec ON consultants(specialization);
CREATE INDEX IF NOT EXISTS idx_consultants_sort ON consultants(sort_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for clean re-run
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Anyone can view active team" ON team_members;
DROP POLICY IF EXISTS "Admins can manage team" ON team_members;
DROP POLICY IF EXISTS "Anyone can subscribe newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;
DROP POLICY IF EXISTS "Admins can manage properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view published newsletters" ON newsletters;
DROP POLICY IF EXISTS "Admins can manage newsletters" ON newsletters;
DROP POLICY IF EXISTS "Anyone can view active consultants" ON consultants;
DROP POLICY IF EXISTS "Admins can manage consultants" ON consultants;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============== USERS POLICIES ==============
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (is_admin());

-- ============== ADMINS POLICIES ==============
CREATE POLICY "Admins can manage admins" ON admins FOR ALL USING (is_admin());

-- ============== TEAM MEMBERS POLICIES ==============
CREATE POLICY "Anyone can view active team" ON team_members FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins can manage team" ON team_members FOR ALL USING (is_admin());

-- ============== NEWSLETTER SUBSCRIBERS POLICIES ==============
CREATE POLICY "Anyone can subscribe newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view newsletter subscribers" ON newsletter_subscribers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers FOR UPDATE USING (is_admin());

-- ============== PROPERTIES POLICIES ==============
CREATE POLICY "Anyone can view active properties" ON properties FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins can manage properties" ON properties FOR ALL USING (is_admin());

-- ============== NEWSLETTERS POLICIES ==============
CREATE POLICY "Anyone can view published newsletters" ON newsletters FOR SELECT USING (is_published = TRUE OR is_admin());
CREATE POLICY "Admins can manage newsletters" ON newsletters FOR ALL USING (is_admin());

-- ============== CONSULTANTS POLICIES ==============
CREATE POLICY "Anyone can view active consultants" ON consultants FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins can manage consultants" ON consultants FOR ALL USING (is_admin());

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_team_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON newsletters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_consultants_updated_at BEFORE UPDATE ON consultants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================
DO $$
DECLARE
    admin_email TEXT := 'brandonadii39@gmail.com';
    admin_uuid UUID;
BEGIN
    SELECT id INTO admin_uuid FROM auth.users WHERE email = admin_email;
    
    IF admin_uuid IS NULL THEN
        RAISE NOTICE '========================================';
        RAISE NOTICE 'ADMIN SETUP REQUIRED';
        RAISE NOTICE '========================================';
        RAISE NOTICE '1. Go to Supabase Dashboard > Authentication > Users';
        RAISE NOTICE '2. Create user: brandonadii39@gmail.com / Password123';
        RAISE NOTICE '3. Copy the UUID from auth.users';
        RAISE NOTICE '4. Run the INSERT queries below with that UUID';
        RAISE NOTICE '========================================';
    ELSE
        RAISE NOTICE 'Admin user found with UUID: %', admin_uuid;
        
        INSERT INTO users (id, email, full_name, role, email_verified)
        VALUES (admin_uuid, admin_email, 'Admin User', 'admin', true)
        ON CONFLICT (id) DO UPDATE SET role = 'admin', email_verified = true;
        
        INSERT INTO admins (user_id, permissions)
        VALUES (admin_uuid, ARRAY['all'])
        ON CONFLICT (user_id) DO UPDATE SET permissions = ARRAY['all'];
        
        RAISE NOTICE 'Admin configured successfully!';
    END IF;
END $$;

-- =====================================================
-- SAMPLE DATA (Optional - Uncomment to add)
-- =====================================================

-- Sample Team Members:
-- INSERT INTO team_members (name, position, bio, is_active, sort_order) VALUES
-- ('Sample Member', 'CEO', 'Bio here', true, 1);

-- Sample Consultants:
-- INSERT INTO consultants (name, title, specialization, bio, is_active, sort_order) VALUES
-- ('Sample Consultant', 'Senior Consultant', 'Business Advisory', 'Bio here', true, 1);

-- Sample Newsletter Subscriber:
-- INSERT INTO newsletter_subscribers (email) VALUES ('test@example.com');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- SELECT 'users' as table_name, count(*) as count FROM users
-- UNION ALL SELECT 'admins', count(*) FROM admins
-- UNION ALL SELECT 'team_members', count(*) FROM team_members
-- UNION ALL SELECT 'newsletter_subscribers', count(*) FROM newsletter_subscribers
-- UNION ALL SELECT 'properties', count(*) FROM properties
-- UNION ALL SELECT 'newsletters', count(*) FROM newsletters
-- UNION ALL SELECT 'consultants', count(*) FROM consultants;
