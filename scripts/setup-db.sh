#!/bin/bash

# Database setup script for func(Kode) site
echo "Setting up func(Kode) database schema..."

# Check if Supabase is configured
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not found in environment"
    echo "Please set up your .env.local file with Supabase credentials"
    exit 1
fi

echo "✅ Environment variables detected"

# Note: This script requires you to run the SQL in database/schema.sql manually in your Supabase dashboard
echo ""
echo "📋 Manual Setup Required:"
echo "1. Go to your Supabase Dashboard → SQL Editor"
echo "2. Copy and paste the contents of 'database/schema.sql'"
echo "3. Run the SQL to create all required tables and policies"
echo ""
echo "Tables that will be created:"
echo "  - rsvp_responses (for event RSVPs)"
echo "  - events (for community events)"
echo "  - projects (for project submissions)"
echo ""
echo "🔧 After running the SQL, your project submission system will be fully functional!"
echo ""
echo "Test the setup by:"
echo "1. Navigate to /submit-project"
echo "2. Log in with GitHub OAuth"
echo "3. Submit a test project"
echo "4. Check /admin/projects to approve it"
echo "5. View it on /projects page"
