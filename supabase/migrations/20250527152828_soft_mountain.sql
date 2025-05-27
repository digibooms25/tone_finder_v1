/*
  # Add examples column to tone_profiles table

  1. Changes
    - Add `examples` column to store tone examples as a text array
  2. Notes
    - Using text[] to store multiple examples
    - Default to empty array if no examples provided
*/

ALTER TABLE tone_profiles
ADD COLUMN IF NOT EXISTS examples text[] DEFAULT array[]::text[];