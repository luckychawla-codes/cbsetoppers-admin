-- SQL Migration to add icon_url to subjects table
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS icon_url TEXT;
