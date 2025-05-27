/*
  # Create tone profiles table

  1. New Tables
    - `tone_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `formality` (float, tone trait)
      - `brevity` (float, tone trait)
      - `humor` (float, tone trait)
      - `warmth` (float, tone trait)
      - `directness` (float, tone trait)
      - `expressiveness` (float, tone trait)
      - `summary` (text, generated summary)
      - `prompt` (text, generated prompt)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `tone_profiles` table
    - Add policies for users to manage their own tone profiles
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

-- Allow users to read their own tone profiles
CREATE POLICY "Users can read their own tone profiles"
  ON tone_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own tone profiles
CREATE POLICY "Users can insert their own tone profiles"
  ON tone_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tone profiles
CREATE POLICY "Users can update their own tone profiles"
  ON tone_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own tone profiles
CREATE POLICY "Users can delete their own tone profiles"
  ON tone_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);