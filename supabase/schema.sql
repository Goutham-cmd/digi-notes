-- ============================================================
-- NoteNest Phase 2 — Complete Supabase Database Schema
-- Run this script in the Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Run
-- ============================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'contributor', 'moderator', 'admin')),
  university TEXT DEFAULT 'Engineering & Tech Campus',
  department TEXT DEFAULT 'Computer Science',
  semester TEXT DEFAULT 'Semester 4',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE RESTRICT NOT NULL,
  semester TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  downloads_count INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'Published' NOT NULL CHECK (status IN ('Published', 'In Review', 'Draft')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, note_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON public.notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_uploader_id ON public.notes(uploader_id);
CREATE INDEX IF NOT EXISTS idx_notes_status ON public.notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_downloads ON public.notes(downloads_count DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_note_id ON public.bookmarks(note_id);

-- TRIGGER FOR AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FUNCTION FOR SAFE DOWNLOAD COUNT INCREMENT
CREATE OR REPLACE FUNCTION public.increment_downloads(note_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notes
  SET downloads_count = downloads_count + 1
  WHERE id = note_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent users from self-assigning admin/moderator roles
    AND (role IS NULL OR role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
  );

-- SUBJECTS POLICIES
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  TO authenticated, anon
  USING (true);

-- NOTES POLICIES
DROP POLICY IF EXISTS "Authenticated users can view published notes or own notes" ON public.notes;
CREATE POLICY "Authenticated users can view published notes or own notes"
  ON public.notes FOR SELECT
  TO authenticated
  USING (status = 'Published' OR uploader_id = auth.uid());

DROP POLICY IF EXISTS "Users can upload notes under their own account" ON public.notes;
CREATE POLICY "Users can upload notes under their own account"
  ON public.notes FOR INSERT
  TO authenticated
  WITH CHECK (uploader_id = auth.uid());

DROP POLICY IF EXISTS "Users can edit only their own notes" ON public.notes;
CREATE POLICY "Users can edit only their own notes"
  ON public.notes FOR UPDATE
  TO authenticated
  USING (uploader_id = auth.uid())
  WITH CHECK (uploader_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete only their own notes" ON public.notes;
CREATE POLICY "Users can delete only their own notes"
  ON public.notes FOR DELETE
  TO authenticated
  USING (uploader_id = auth.uid());

-- BOOKMARKS POLICIES
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can create their own bookmarks"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- STORAGE SETUP & POLICIES
-- ============================================================

-- Create 'notes' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notes',
  'notes',
  true,
  52428800, -- 50 MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Storage Policies
DROP POLICY IF EXISTS "Authenticated users can upload note files" ON storage.objects;
CREATE POLICY "Authenticated users can upload note files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'notes' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own note files" ON storage.objects;
CREATE POLICY "Users can update their own note files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'notes' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own note files" ON storage.objects;
CREATE POLICY "Users can delete their own note files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'notes' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Authenticated users can download note files" ON storage.objects;
CREATE POLICY "Authenticated users can download note files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'notes');

-- ============================================================
-- SEED INITIAL SUBJECTS
-- ============================================================
INSERT INTO public.subjects (name, description) VALUES
  ('Data Structures & Algorithms', 'Core computer science algorithms, complexity analysis, trees, graphs, and dynamic programming.'),
  ('Operating Systems', 'Process management, concurrency, virtualization, memory management, and file system architectures.'),
  ('Database Management Systems', 'Relational database modeling, SQL queries, normalization, transactions, and ACID principles.'),
  ('Computer Networks', 'OSI and TCP/IP models, routing protocols, socket programming, and network security foundations.'),
  ('Artificial Intelligence & Machine Learning', 'Supervised and unsupervised learning, neural networks, computer vision, and heuristic search algorithms.'),
  ('Engineering Mathematics', 'Calculus, linear algebra, probability, differential equations, and numerical methods.'),
  ('Software Engineering & System Design', 'Agile methodologies, UML modeling, design patterns, microservices, and distributed architecture.'),
  ('Web Technologies & Cloud Computing', 'Modern full-stack web development, REST APIs, cloud infrastructure, and DevOps pipelines.')
ON CONFLICT (name) DO NOTHING;

