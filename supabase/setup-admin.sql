-- =====================================================
-- PARAYSCO CONSULTING - COMPLETE ADMIN SETUP SCRIPT
-- =====================================================
-- Run this AFTER running schema.sql
-- This creates the admin user: ${ADMIN_EMAIL}
-- =====================================================

-- IMPORTANT: Before running this script:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Create user with:
--    Email: ${ADMIN_EMAIL}
--    Password: ${ADMIN_PASSWORD}
-- 4. Copy the user's UUID
-- 5. Replace 'YOUR_ADMIN_UUID_HERE' below with that UUID
-- 6. Run this script
-- =====================================================

-- STEP 1: Replace this with the actual UUID from auth.users
-- (Get it from Supabase Dashboard > Authentication > Users table)
DO $$
DECLARE
    admin_email TEXT := '${ADMIN_EMAIL}';
    admin_uuid UUID := NULL;  -- Replace with actual UUID from auth.users
BEGIN
    -- Try to find existing user
    SELECT id INTO admin_uuid FROM auth.users WHERE email = admin_email;
    
    IF admin_uuid IS NULL THEN
        RAISE NOTICE '========================================';
        RAISE NOTICE 'ERROR: Admin user not found in auth.users';
        RAISE NOTICE 'Please create the user first in:';
        RAISE NOTICE 'Supabase Dashboard > Authentication > Users > Add User';
        RAISE NOTICE 'Email: ${ADMIN_EMAIL}';
        RAISE NOTICE 'Password: ${ADMIN_PASSWORD}';
        RAISE NOTICE 'Then copy the UUID and update this script.';
        RAISE NOTICE '========================================';
    ELSE
        -- Insert into users table
        INSERT INTO users (id, email, full_name, role, email_verified)
        VALUES (admin_uuid, admin_email, 'Admin User', 'admin', true)
        ON CONFLICT (id) DO UPDATE SET 
            role = 'admin', 
            email_verified = true,
            full_name = COALESCE(NULLIF(users.full_name, ''), 'Admin User');
        
        -- Insert into admins table
        INSERT INTO admins (user_id, permissions)
        VALUES (admin_uuid, ARRAY['all'])
        ON CONFLICT (user_id) DO UPDATE SET permissions = ARRAY['all'];
        
        RAISE NOTICE '========================================';
        RAISE NOTICE 'SUCCESS: Admin user configured!';
        RAISE NOTICE 'Email: ${ADMIN_EMAIL}';
        RAISE NOTICE 'UUID: %', admin_uuid;
        RAISE NOTICE '========================================';
    END IF;
END $$;

-- =====================================================
-- VERIFICATION
-- Run these queries separately to verify setup:
-- =====================================================

-- Query 1: Check if admin user exists
-- SELECT 
--     u.id,
--     u.email,
--     u.full_name,
--     u.role,
--     u.email_verified,
--     CASE WHEN a.user_id IS NOT NULL THEN 'YES' ELSE 'NO' END as is_admin
-- FROM users u
-- LEFT JOIN admins a ON u.id = a.user_id
-- WHERE u.email = '${ADMIN_EMAIL}';

-- Query 2: Check all admins
-- SELECT u.email, u.full_name, a.permissions, a.created_at
-- FROM users u
-- INNER JOIN admins a ON u.id = a.user_id;
