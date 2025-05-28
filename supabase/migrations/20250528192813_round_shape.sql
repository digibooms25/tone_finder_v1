-- Create the tone_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS tone_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  formality float NOT NULL,
  brevity float NOT NULL,
  humor float NOT NULL,
  warmth float NOT NULL,
  directness float NOT NULL,
  expressiveness float NOT NULL,
  summary text NOT NULL,
  prompt text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  examples text[] DEFAULT ARRAY[]::text[]
);

-- Enable RLS if not already enabled
ALTER TABLE tone_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read their own tone profiles" ON tone_profiles;
    DROP POLICY IF EXISTS "Users can insert their own tone profiles" ON tone_profiles;
    DROP POLICY IF EXISTS "Users can update their own tone profiles" ON tone_profiles;
    DROP POLICY IF EXISTS "Users can delete their own tone profiles" ON tone_profiles;
END $$;

-- Create policies
CREATE POLICY "Users can read their own tone profiles"
  ON tone_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tone profiles"
  ON tone_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tone profiles"
  ON tone_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tone profiles"
  ON tone_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);