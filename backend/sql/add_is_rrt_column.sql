-- Add is_rrt column to shifts table to flag RRT shifts
BEGIN;

ALTER TABLE public.shifts 
ADD COLUMN IF NOT EXISTS is_rrt BOOLEAN NOT NULL DEFAULT false;

-- Update existing RRT shifts
UPDATE public.shifts 
SET is_rrt = true 
WHERE shift_type_id = (SELECT id FROM shift_types WHERE name = 'RRT');

COMMIT;
