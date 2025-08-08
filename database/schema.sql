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

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    language TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Web App', 'Mobile App', 'CLI Tool', 'Library', 'Game', 'AI/ML')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read approved projects
CREATE POLICY "Anyone can view approved projects"
ON projects FOR SELECT
USING (is_approved = true);

-- Allow users to insert their own projects
CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own projects (even if not approved)
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to manage all projects
CREATE POLICY "Admins can manage all projects"
ON projects FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
)
WITH CHECK (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_approved ON projects(is_approved);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_views_count ON projects(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_likes_count ON projects(likes_count DESC);

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT NOT NULL,
    live_url TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 
        'DevOps', 'Blockchain', 'Game Development', 'Desktop Applications', 
        'API/Backend', 'CLI Tools'
    )),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    tags TEXT[] NOT NULL DEFAULT '{}',
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read approved projects
CREATE POLICY "Anyone can view approved projects"
ON projects FOR SELECT
USING (approved = true);

-- Allow users to insert their own projects
CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own projects
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to manage all projects
CREATE POLICY "Admins can manage all projects"
ON projects FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
)
WITH CHECK (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_projects_approved ON projects(approved);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create the users table for user profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    github_username TEXT,
    display_name TEXT,
    bio TEXT,
    skills TEXT,
    role_preference TEXT,
    interests TEXT,
    avatar_url TEXT,
    github_access_token TEXT,
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own profile
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON users FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_github_username ON users(github_username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_onboarded ON users(is_onboarded);

-- Create trigger for users updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
