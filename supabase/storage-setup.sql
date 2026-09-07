-- =====================================================
-- SUPABASE STORAGE SETUP
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create the images bucket (for team, properties, consultants)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

-- Create the media bucket (for products, newsletters)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

-- =====================================================
-- STORAGE POLICIES FOR 'images' BUCKET
-- =====================================================

-- Drop existing policies for clean re-run
DROP POLICY IF EXISTS "Public can view images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage images bucket" ON storage.objects;

-- Allow anyone to view images
CREATE POLICY "Public can view images bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Uploads require an authenticated admin session (the app's admin pages
-- and /api/upload run with the signed-in user's session; anonymous uploads
-- would let anyone host arbitrary files on our domain).
CREATE POLICY "Admins can upload to images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
));

-- Allow admins to manage images bucket
CREATE POLICY "Admins can manage images bucket" ON storage.objects
FOR ALL USING (bucket_id = 'images' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
));

-- =====================================================
-- STORAGE POLICIES FOR 'media' BUCKET
-- =====================================================

DROP POLICY IF EXISTS "Public can view media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage media bucket" ON storage.objects;

-- Allow anyone to view media
CREATE POLICY "Public can view media bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Uploads require an authenticated admin session (see notes above).
CREATE POLICY "Admins can upload to media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
));

-- Allow admins to manage media bucket
CREATE POLICY "Admins can manage media bucket" ON storage.objects
FOR ALL USING (bucket_id = 'media' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = auth.uid()
));

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check if buckets were created:
-- SELECT * FROM storage.buckets;

-- Check policies:
-- SELECT policyname, cmd, schemaname FROM pg_policies WHERE tablename = 'objects';
