-- Add department and priority columns to reports table
-- Run this in Supabase SQL Editor

-- Add department column (stores which government department should handle this)
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS department TEXT;

-- Add priority column (stores AI-assessed priority: low, medium, high)
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Add index for faster filtering by department
CREATE INDEX IF NOT EXISTS idx_reports_department ON reports(department);

-- Add index for faster filtering by priority
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);

-- Update existing reports with default values
UPDATE reports 
SET department = 'Public Works' 
WHERE department IS NULL;

UPDATE reports 
SET priority = 'medium' 
WHERE priority IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('department', 'priority');
