-- Add gallery_urls column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
