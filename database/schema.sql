-- Create the RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    github_username TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'professional', 'exploring')),
    goals TEXT[] NOT NULL DEFAULT '{}',
    attendance_type TEXT NOT NULL CHECK (attendance_type IN ('virtual', 'onsite')),
    comments TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security (RLS)
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own responses
CREATE POLICY "Users can insert their own responses"
ON rsvp_responses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to view their own responses
CREATE POLICY "Users can view their own responses"
ON rsvp_responses FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for admins to view all responses
CREATE POLICY "Admins can view all responses"
ON rsvp_responses FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- Create policy for public access (if needed for anonymous submissions)
CREATE POLICY "Anyone can insert responses"
ON rsvp_responses FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy for public read (if needed)
CREATE POLICY "Anyone can view responses"
ON rsvp_responses FOR SELECT
TO anon
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_created_at ON rsvp_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_email ON rsvp_responses(email);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_user_id ON rsvp_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_role ON rsvp_responses(role);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_attendance_type ON rsvp_responses(attendance_type);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rsvp_responses_updated_at
    BEFORE UPDATE ON rsvp_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
