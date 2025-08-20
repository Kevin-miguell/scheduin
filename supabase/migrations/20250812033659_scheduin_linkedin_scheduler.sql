-- Location: supabase/migrations/20250812033659_scheduin_linkedin_scheduler.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete LinkedIn scheduling system creation
-- Dependencies: None - fresh schema

-- ================== TYPES ==================

CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE public.post_type AS ENUM ('text', 'image', 'video', 'document', 'carousel');
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.media_type AS ENUM ('image', 'video', 'document', 'pdf');
CREATE TYPE public.timezone_enum AS ENUM (
  'America/New_York', 'America/Los_Angeles', 'America/Chicago', 
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 
  'Australia/Sydney', 'UTC'
);

-- ================== CORE TABLES ==================

-- User profiles (intermediary between auth.users and app tables)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    timezone public.timezone_enum DEFAULT 'UTC'::public.timezone_enum,
    linkedin_connected BOOLEAN DEFAULT false,
    linkedin_profile_url TEXT,
    avatar_url TEXT,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn connections and tokens
CREATE TABLE public.linkedin_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    linkedin_user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    profile_data JSONB,
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Media library for storing uploaded files
CREATE TABLE public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    media_type public.media_type NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    folder_path TEXT DEFAULT 'uploads',
    is_public BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- LinkedIn posts
CREATE TABLE public.linkedin_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type public.post_type NOT NULL DEFAULT 'text'::public.post_type,
    status public.post_status NOT NULL DEFAULT 'draft'::public.post_status,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    linkedin_post_id TEXT UNIQUE,
    first_comment TEXT,
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    media_ids UUID[] DEFAULT ARRAY[]::UUID[],
    engagement_metrics JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Post analytics and metrics
CREATE TABLE public.post_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.linkedin_posts(id) ON DELETE CASCADE,
    linkedin_post_id TEXT NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    collected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, collected_at::DATE)
);

-- User settings and preferences
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    optimal_posting_times JSONB DEFAULT '[]'::jsonb,
    default_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    auto_add_first_comment BOOLEAN DEFAULT false,
    default_first_comment TEXT,
    notification_settings JSONB DEFAULT '{
        "scheduled_post_reminder": true,
        "post_published": true,
        "post_failed": true,
        "weekly_analytics": true
    }'::jsonb,
    content_templates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ================== INDEXES ==================

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_linkedin_connections_user_id ON public.linkedin_connections(user_id);
CREATE INDEX idx_media_library_user_id ON public.media_library(user_id);
CREATE INDEX idx_media_library_type ON public.media_library(media_type);
CREATE INDEX idx_linkedin_posts_user_id ON public.linkedin_posts(user_id);
CREATE INDEX idx_linkedin_posts_status ON public.linkedin_posts(status);
CREATE INDEX idx_linkedin_posts_scheduled ON public.linkedin_posts(scheduled_for);
CREATE INDEX idx_linkedin_posts_published ON public.linkedin_posts(published_at);
CREATE INDEX idx_post_analytics_post_id ON public.post_analytics(post_id);
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

-- ================== RLS SETUP ==================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ================== HELPER FUNCTIONS ==================

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- ================== RLS POLICIES ==================

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for all other tables
CREATE POLICY "users_manage_own_linkedin_connections"
ON public.linkedin_connections
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_media_library"
ON public.media_library
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_linkedin_posts"
ON public.linkedin_posts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_post_analytics"
ON public.post_analytics
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.linkedin_posts lp 
        WHERE lp.id = post_id AND lp.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.linkedin_posts lp 
        WHERE lp.id = post_id AND lp.user_id = auth.uid()
    )
);

CREATE POLICY "users_manage_own_user_settings"
ON public.user_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin policies for full access
CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_linkedin_posts"
ON public.linkedin_posts
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- ================== FUNCTIONS ==================

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- ================== TRIGGERS ==================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_linkedin_connections_updated_at
  BEFORE UPDATE ON public.linkedin_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_linkedin_posts_updated_at
  BEFORE UPDATE ON public.linkedin_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_analytics_updated_at
  BEFORE UPDATE ON public.post_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================== STORAGE BUCKETS ==================

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'media-library',
    'media-library',
    false,
    52428800, -- 50MB limit
    ARRAY[
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  );

-- ================== STORAGE RLS POLICIES ==================

-- Media library bucket (private)
CREATE POLICY "users_view_own_media_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'media-library' AND owner = auth.uid());

CREATE POLICY "users_upload_own_media_files" 
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'media-library' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_media_files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media-library' AND owner = auth.uid())
WITH CHECK (bucket_id = 'media-library' AND owner = auth.uid());

CREATE POLICY "users_delete_own_media_files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media-library' AND owner = auth.uid());

-- Avatar bucket (public)
CREATE POLICY "public_can_view_avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "authenticated_users_upload_avatars"
ON storage.objects  
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "owners_manage_avatars"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

-- ================== MOCK DATA ==================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    media_id_1 UUID := gen_random_uuid();
    media_id_2 UUID := gen_random_uuid();
    post_id_1 UUID := gen_random_uuid();
    post_id_2 UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@scheduin.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@scheduin.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Marketing Manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Sample media files
    INSERT INTO public.media_library (id, user_id, filename, original_filename, file_size, media_type, file_url, thumbnail_url, tags, folder_path) VALUES
        (media_id_1, user_uuid, 'company-logo.png', 'Company Logo.png', 45632, 'image'::public.media_type, '/media/company-logo.png', '/media/thumbs/company-logo.png', ARRAY['logo', 'branding'], 'brand-assets'),
        (media_id_2, user_uuid, 'product-demo.mp4', 'Product Demo Video.mp4', 12548621, 'video'::public.media_type, '/media/product-demo.mp4', '/media/thumbs/product-demo.jpg', ARRAY['product', 'demo', 'video'], 'videos');

    -- Sample LinkedIn posts
    INSERT INTO public.linkedin_posts (id, user_id, title, content, post_type, status, scheduled_for, hashtags, media_ids, first_comment) VALUES
        (post_id_1, user_uuid, 'Exciting Product Launch', 
         'We are thrilled to announce the launch of our revolutionary new product that will transform how businesses manage their social media presence. This innovative solution combines AI-powered content creation with advanced scheduling capabilities.',
         'image'::public.post_type, 'scheduled'::public.post_status, 
         now() + interval '2 hours',
         ARRAY['#ProductLaunch', '#Innovation', '#SocialMedia', '#AI'],
         ARRAY[media_id_1],
         'What do you think about this exciting development? Share your thoughts in the comments!'),
        (post_id_2, user_uuid, 'Industry Insights',
         'The future of social media marketing lies in authentic engagement and personalized content. Here are 5 key trends we are seeing in 2025 that every marketer should know about.',
         'text'::public.post_type, 'published'::public.post_status,
         now() - interval '1 day',
         ARRAY['#Marketing', '#SocialMediaTips', '#2025Trends', '#DigitalMarketing'],
         ARRAY[]::UUID[],
         'Which trend resonates most with your marketing strategy?');

    -- Sample analytics data
    INSERT INTO public.post_analytics (post_id, linkedin_post_id, impressions, clicks, likes, comments, shares, engagement_rate, reach) VALUES
        (post_id_2, 'linkedin-post-123456', 2847, 234, 89, 15, 7, 3.89, 2634);

    -- Sample LinkedIn connection (mock data)
    INSERT INTO public.linkedin_connections (user_id, linkedin_user_id, access_token, expires_at, profile_data) VALUES
        (user_uuid, 'linkedin-user-789', 'mock-access-token-xyz', now() + interval '30 days', 
         '{"name": "Marketing Manager", "headline": "Digital Marketing Specialist", "industry": "Marketing and Advertising"}'::jsonb);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data insertion: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data insertion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data insertion: %', SQLERRM;
END $$;

-- ================== CLEANUP FUNCTION ==================

CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs to delete
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@scheduin.com', 'user@scheduin.com');

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.post_analytics WHERE post_id IN (
        SELECT id FROM public.linkedin_posts WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.linkedin_posts WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.media_library WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.linkedin_connections WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_settings WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;