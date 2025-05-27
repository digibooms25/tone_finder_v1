/*
  # Update tone profiles table and policies

  1. Changes
    - Add IF NOT EXISTS checks for policies
    - Ensure policies are only created if they don't already exist
  2. Security
    - Maintain existing RLS policies
    - Keep all security restrictions intact
*/

CREATE TABLE IF NOT EXISTS tone_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  formality float NOT NULL,
  brevity float NOT NULL,
  humor float NOT NULL,
  warmth float NOT NULL,
  directness float NOT NULL,
  expressiveness float NOT NULL,
  summary text NOT NULL,
  prompt text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tone_profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Create read policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tone_profiles' 
    AND policyname = 'Users can read their own tone profiles'
  ) THEN
    CREATE POLICY "Users can read their own tone profiles"
      ON tone_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Create insert policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tone_profiles' 
    AND policyname = 'Users can insert their own tone profiles'
  ) THEN
    CREATE POLICY "Users can insert their own tone profiles"
      ON tone_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create update policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tone_profiles' 
    AND policyname = 'Users can update their own tone profiles'
  ) THEN
    CREATE POLICY "Users can update their own tone profiles"
      ON tone_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Create delete policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tone_profiles' 
    AND policyname = 'Users can delete their own tone profiles'
  ) THEN
    CREATE POLICY "Users can delete their own tone profiles"
      ON tone_profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;