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

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    location TEXT NOT NULL,
    max_attendees INTEGER NOT NULL DEFAULT 10,
    tags TEXT[] NOT NULL DEFAULT '{}',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    event_type TEXT NOT NULL CHECK (event_type IN ('Workshop', 'Hackathon', 'Meetup', 'Conference', 'Sprint')),
    prizes TEXT[] DEFAULT '{}',
    is_upcoming BOOLEAN DEFAULT true,
    is_community_event BOOLEAN DEFAULT true,
    registration_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read events
CREATE POLICY "Anyone can view events"
ON events FOR SELECT
USING (true);

-- Allow admins to manage events
CREATE POLICY "Admins can manage events"
ON events FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
)
WITH CHECK (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- Add event_id to rsvp_responses table
ALTER TABLE rsvp_responses ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id);

-- Create indexes for events
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_is_upcoming ON events(is_upcoming);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_event_id ON rsvp_responses(event_id);

-- Create trigger for events updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert the default "Ship in an hour (#1)" event
INSERT INTO events (
    id,
    name,
    date,
    time,
    description,
    long_description,
    location,
    max_attendees,
    tags,
    difficulty,
    event_type,
    prizes,
    is_upcoming,
    is_community_event
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Ship in an hour (#1)',
    '2025-08-02 13:30:00+00:00',
    '1:30 PM - 5:30 PM',
    'Join our open-source sprint! Build a fun project, share on GitHub, and win badges.',
    'A fast-paced coding sprint where developers come together to build, ship, and showcase amazing projects in just one hour. Whether you are a beginner or expert, this event is designed to push your creativity and coding skills to the limit.',
    'GITAM University',
    10,
    ARRAY['Open Source', 'Sprint', 'GitHub', 'Collaboration'],
    'Intermediate',
    'Sprint',
    ARRAY['GitHub Badges', 'Featured Project Showcase', 'Networking'],
    true,
    true
) ON CONFLICT (id) DO NOTHING;
