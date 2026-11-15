-- ============================================================
-- NoteNest Phase 3 — Complete Admin & Moderation Schema Migration
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Run
-- ============================================================

-- 1. EXTEND PROFILES TABLE WITH SUSPENSION STATUS
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. EXTEND NOTES TABLE WITH REJECTION REASON & FLEXIBLE STATUSES
ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update status constraint to support 'pending', 'published', 'rejected'
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_status_check;
ALTER TABLE public.notes
  ADD CONSTRAINT notes_status_check 
  CHECK (status IN ('pending', 'published', 'rejected', 'Published', 'In Review', 'Draft'));

-- 3. CREATE AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_email TEXT,
  action_type TEXT NOT NULL,
  target_record TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.admin_audit_logs(action_type);

-- 4. SECURE HELPER FUNCTION FOR CHECKING ADMIN ROLE
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_suspended = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FUNCTION TO LOG ADMIN ACTIONS
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_input TEXT,
  target_record_input TEXT,
  details_input JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
  current_admin_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrative privileges required.';
  END IF;

  SELECT email INTO current_admin_email FROM public.profiles WHERE id = auth.uid();

  INSERT INTO public.admin_audit_logs (admin_id, admin_email, action_type, target_record, details)
  VALUES (auth.uid(), current_admin_email, action_type_input, target_record_input, details_input)
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ENHANCED ROW LEVEL SECURITY (RLS) FOR ADMIN & MODERATION
-- ============================================================

-- PROFILES RLS
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id)
  WITH CHECK (
    -- Admins can update anything
    public.is_admin()
    OR
    -- Students cannot change their own role or suspension status
    (
      auth.uid() = id
      AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      AND is_suspended = (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
    )
  );

-- NOTES RLS
DROP POLICY IF EXISTS "Authenticated users can view published notes or own notes" ON public.notes;
CREATE POLICY "Authenticated users can view published notes or own notes"
  ON public.notes FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR status IN ('published', 'Published')
    OR uploader_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can upload notes under their own account" ON public.notes;
CREATE POLICY "Users can upload notes under their own account"
  ON public.notes FOR INSERT
  TO authenticated
  WITH CHECK (
    uploader_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_suspended = true
    )
  );

DROP POLICY IF EXISTS "Admins and owners can update notes" ON public.notes;
CREATE POLICY "Admins and owners can update notes"
  ON public.notes FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR uploader_id = auth.uid())
  WITH CHECK (public.is_admin() OR uploader_id = auth.uid());

DROP POLICY IF EXISTS "Admins and owners can delete notes" ON public.notes;
CREATE POLICY "Admins and owners can delete notes"
  ON public.notes FOR DELETE
  TO authenticated
  USING (public.is_admin() OR uploader_id = auth.uid());

-- SUBJECTS RLS: Admins can modify subjects
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
CREATE POLICY "Admins can insert subjects"
  ON public.subjects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
CREATE POLICY "Admins can update subjects"
  ON public.subjects FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;
CREATE POLICY "Admins can delete subjects"
  ON public.subjects FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- AUDIT LOGS RLS: Immutable; only admins can view and insert
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only admins can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 6. MAKE EXISTING REGISTERED USER AN ADMIN
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'aagouthamcse@gmail.com';

