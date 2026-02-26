-- ============================================================
-- CBSE TOPPERS: operators table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create operators table
CREATE TABLE IF NOT EXISTS public.operators (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL CHECK (role IN ('ceo', 'founder', 'owner')),
    student_id  TEXT REFERENCES public.students(student_id) ON DELETE SET NULL,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: only authenticated operators can read
CREATE POLICY "Operators can view all operators"
    ON public.operators FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- 4. RLS Policy: only operators can insert
CREATE POLICY "Operators can insert operators"
    ON public.operators FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 5. RLS Policy: only operators can delete
CREATE POLICY "Operators can delete operators"
    ON public.operators FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 6. SEED: Insert Lucky Chawla as Founder
--    IMPORTANT: First create this auth user in Supabase Dashboard:
--      Email:    luckychawla@zohomail.in
--      Password: (set it in the admin app create form OR in Supabase Auth dashboard)
-- ============================================================
INSERT INTO public.operators (email, name, role)
VALUES ('luckychawla@zohomail.in', 'Lucky Chawla', 'founder')
ON CONFLICT (email) DO UPDATE
    SET name = 'Lucky Chawla', role = 'founder';

-- ============================================================
-- 7. Link operator to student if same email exists
-- ============================================================
UPDATE public.operators o
SET student_id = s.student_id
FROM public.students s
WHERE LOWER(s.email) = LOWER(o.email)
  AND o.student_id IS NULL;
