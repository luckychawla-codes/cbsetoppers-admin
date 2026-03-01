-- 1. Add order_index to subjects
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 2. Add order_index to folders
ALTER TABLE public.folders ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 3. Add order_index to materials
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Initialize subjects order_index based on name
WITH ranked_s AS (SELECT id, ROW_NUMBER() OVER (ORDER BY name) - 1 as rn FROM public.subjects)
UPDATE public.subjects SET order_index = ranked_s.rn FROM ranked_s WHERE public.subjects.id = ranked_s.id;
