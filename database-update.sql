-- Add missing columns to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS interview_package TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Update existing records to have default values
UPDATE articles 
SET interview_package = 'basic' 
WHERE interview_package IS NULL;

UPDATE articles 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;
