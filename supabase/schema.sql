-- Paraysco Consulting Inc. Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- ADMIN TABLE
-- =====================================================
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    description TEXT,
    description_en TEXT,
    description_fr TEXT,
    price DECIMAL(15, 2) NOT NULL,
    location VARCHAR(255),
    location_en VARCHAR(255),
    location_fr VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('residential', 'commercial', 'land', 'industrial')),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'archived')),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqm DECIMAL(10, 2),
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties(location);

-- =====================================================
-- PROPERTY IMAGES TABLE
-- =====================================================
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_images_property ON property_images(property_id);

-- =====================================================
-- CATEGORIES TABLE (Must be created before blog_posts)
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    excerpt_en TEXT,
    excerpt_fr TEXT,
    content TEXT,
    content_en TEXT,
    content_fr TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    tags TEXT[],
    published BOOLEAN DEFAULT FALSE,
    reading_time INTEGER,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_published ON blog_posts(published);
CREATE INDEX idx_blog_author ON blog_posts(author_id);

-- =====================================================
-- CONSULTANTS TABLE
-- =====================================================
CREATE TABLE consultants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    title VARCHAR(255),
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    bio TEXT,
    bio_en TEXT,
    bio_fr TEXT,
    image_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url TEXT,
    specialization TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    title VARCHAR(255),
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    bio TEXT,
    bio_en TEXT,
    bio_fr TEXT,
    image_url TEXT,
    role VARCHAR(50) CHECK (role IN ('founder', 'co-founder', 'executive', 'manager', 'staff')),
    department VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_role ON team_members(role);

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_en TEXT,
    description_fr TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    features TEXT[],
    features_en TEXT[],
    features_fr TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_slug ON services(slug);

-- =====================================================
-- SUBCOMPANIES TABLE
-- =====================================================
CREATE TABLE subcompanies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_en TEXT,
    description_fr TEXT,
    logo_url TEXT,
    website_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subcompanies_slug ON subcompanies(slug);

-- =====================================================
-- SUBCOMPANY SERVICES TABLE
-- =====================================================
CREATE TABLE subcompany_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcompany_id UUID REFERENCES subcompanies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    description TEXT,
    description_en TEXT,
    description_fr TEXT
);

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_status ON contact_messages(status);
CREATE INDEX idx_contacts_created ON contact_messages(created_at);

-- =====================================================
-- NEWSLETTER TABLE
-- =====================================================
CREATE TABLE newsletter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT TRUE,
    confirmed BOOLEAN DEFAULT FALSE,
    confirmation_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter(email);

-- =====================================================
-- LANGUAGES TABLE
-- =====================================================
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0
);

-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    group_name VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON site_settings(key);
CREATE INDEX idx_settings_group ON site_settings(group_name);

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_name_en VARCHAR(255),
    client_name_fr VARCHAR(255),
    company VARCHAR(255),
    company_en VARCHAR(255),
    company_fr VARCHAR(255),
    content TEXT NOT NULL,
    content_en TEXT,
    content_fr TEXT,
    image_url TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CAREERS TABLE
-- =====================================================
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_en TEXT,
    description_fr TEXT,
    requirements TEXT[],
    requirements_en TEXT[],
    requirements_fr TEXT[],
    location VARCHAR(255),
    location_en VARCHAR(255),
    location_fr VARCHAR(255),
    salary_range VARCHAR(100),
    employment_type VARCHAR(50) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
    department VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    closing_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_careers_slug ON careers(slug);
CREATE INDEX idx_careers_published ON careers(published);

-- =====================================================
-- FAQs TABLE
-- =====================================================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question VARCHAR(500) NOT NULL,
    question_en VARCHAR(500),
    question_fr VARCHAR(500),
    answer TEXT,
    answer_en TEXT,
    answer_fr TEXT,
    category VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);

-- =====================================================
-- MEDIA LIBRARY TABLE
-- =====================================================
CREATE TABLE media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    folder VARCHAR(255),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_folder ON media_library(folder);
CREATE INDEX idx_media_mime ON media_library(mime_type);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);

-- =====================================================
-- PASSWORD RESET TOKENS TABLE
-- =====================================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_user ON password_reset_tokens(user_id);

-- =====================================================
-- SESSIONS TABLE
-- =====================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_token ON sessions(token);
CREATE INDEX idx_session_user ON sessions(user_id);

-- =====================================================
-- HERO SLIDES TABLE
-- =====================================================
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    subtitle TEXT,
    subtitle_en TEXT,
    subtitle_fr TEXT,
    background_image TEXT,
    cta_text VARCHAR(100),
    cta_text_en VARCHAR(100),
    cta_text_fr VARCHAR(100),
    cta_link VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STATISTICS TABLE
-- =====================================================
CREATE TABLE statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    label_en VARCHAR(100),
    label_fr VARCHAR(100),
    value VARCHAR(50) NOT NULL,
    suffix VARCHAR(20),
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0
);

-- =====================================================
-- PARTNERS TABLE
-- =====================================================
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    logo_url TEXT NOT NULL,
    website_url TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMPANY TIMELINE TABLE
-- =====================================================
CREATE TABLE company_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    description TEXT,
    description_en TEXT,
    description_fr TEXT,
    order_index INTEGER DEFAULT 0
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcompanies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcompany_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_timeline ENABLE ROW LEVEL SECURITY;

-- Public read policies for content tables
CREATE POLICY "Public can view published properties"
    ON properties FOR SELECT
    USING (status != 'archived');

CREATE POLICY "Public can view published blog posts"
    ON blog_posts FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view categories"
    ON categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view consultants"
    ON consultants FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view team members"
    ON team_members FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view services"
    ON services FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view subcompanies"
    ON subcompanies FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view subcompany services"
    ON subcompany_services FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view testimonials"
    ON testimonials FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view FAQs"
    ON faqs FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view careers"
    ON careers FOR SELECT
    USING (published = true);

CREATE POLICY "Public can view media"
    ON media_library FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view hero slides"
    ON hero_slides FOR SELECT
    TO anon, authenticated
    USING (active = true);

CREATE POLICY "Public can view statistics"
    ON statistics FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view partners"
    ON partners FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view timeline"
    ON company_timeline FOR SELECT
    TO anon, authenticated
    USING (true);

-- Insert policies
CREATE POLICY "Anyone can subscribe to newsletter"
    ON newsletter FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can submit contact form"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

-- Admin policies (authenticated users with admin role)
CREATE POLICY "Admins can manage properties"
    ON properties FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage blog posts"
    ON blog_posts FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- User management policies
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

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
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultants_updated_at
    BEFORE UPDATE ON consultants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcompanies_updated_at
    BEFORE UPDATE ON subcompanies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at
    BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default languages
INSERT INTO languages (code, name, native_name, is_default, is_active, order_index) VALUES
('en', 'English', 'English', true, true, 1),
('fr', 'French', 'Français', false, true, 2);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, full_name, role, email_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@paraysco.com', 'Admin User', 'admin', true);

INSERT INTO admins (user_id, permissions) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['all']);
