# Enhanced RSVP System Setup

This document describes the enhanced RSVP system with admin dashboard that has been built for the func(Kode) platform.

## Features

### RSVP Form (`/rsvp`)
- **Full Name**: Text input for user's full name
- **Email Address**: Auto-filled from user profile if authenticated
- **Phone Number**: Required field with validation (minimum 10 digits)
- **GitHub Username**: Auto-filled from user profile if authenticated, read-only
- **Role Selection**: Dropdown with options (Student, Professional, Exploring)
- **Goals**: Multiple choice checkboxes with options:
  - Networking
  - Learning
  - Hiring Opportunities
  - Just Exploring
- **Attendance Type**: Radio buttons (Virtual or Onsite)
- **Additional Comments**: Optional textarea for extra information

### Admin Dashboard (`/admin`)
- **Access Control**: Only accessible to specified admin emails and GitHub usernames
- **Statistics Overview**: 
  - Total responses
  - Virtual vs Onsite attendance
  - Role distribution (Students, Professionals, Exploring)
- **Search & Filter**:
  - Search by name, email, or GitHub username
  - Filter by role or attendance type
- **Export Feature**: CSV export of filtered results
- **Responsive Design**: Works well on desktop and mobile

## Database Schema

The system uses a Supabase PostgreSQL database with the following table:

```sql
CREATE TABLE rsvp_responses (
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
```

## Setup Instructions

### 1. Database Setup
Run the SQL commands in `/database/schema.sql` in your Supabase SQL editor to create the required table and policies.

### 2. Admin Access Configuration
The admin access is controlled by these constants in `/app/admin/page.tsx`:

```typescript
const ADMIN_EMAILS = ["vvs.pedapati@rediffmail.com"];
const ADMIN_GITHUB_USERNAMES = ["basanth-pedapati"];
```

To add more admins, simply add their email addresses or GitHub usernames to these arrays.

### 3. Environment Variables
Ensure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Dependencies
The following new UI components were added:
- `/components/ui/textarea.tsx`
- `/components/ui/select.tsx`

These follow the same pattern as existing UI components and use Tailwind CSS for styling.

## Usage

### For Users
1. Navigate to `/rsvp`
2. Fill out the form with required information
3. Submit the RSVP
4. Receive confirmation toast message

### For Admins
1. Navigate to `/admin`
2. System checks if user email or GitHub username is in admin list
3. If authorized, view dashboard with:
   - Statistics overview
   - Search and filter capabilities
   - Individual response cards
   - CSV export functionality

## UI/UX Features

### Mobile-First Design
- Responsive layout that works on all screen sizes
- Touch-friendly buttons and form elements
- Optimized spacing and typography for mobile

### Visual Feedback
- Real-time form validation with error messages
- Loading states during form submission
- Success/error toast notifications
- Visual indicators for required fields

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- High contrast colors for readability
- Screen reader friendly

## Security Features

### Row Level Security (RLS)
- Users can only view their own responses
- Admins can view all responses based on email/GitHub username
- Anonymous submissions are allowed if needed

### Input Validation
- Client-side validation using Zod schema
- Server-side validation through database constraints
- Sanitized inputs to prevent XSS attacks

### Admin Access Control
- Hardcoded admin credentials in code (can be moved to environment variables)
- Multiple authentication factors (email OR GitHub username)
- Graceful access denied messages for non-admins

## Troubleshooting

### Common Issues

1. **"Access Denied" on Admin Page**
   - Check if user email or GitHub username is in admin arrays
   - Ensure user is authenticated

2. **Form Submission Fails**
   - Check Supabase connection and API keys
   - Verify database table exists and has correct permissions
   - Check browser console for error messages

3. **Auto-fill Not Working**
   - Ensure user is authenticated
   - Check if user profile has required metadata (GitHub username)

### Database Policies
If you encounter permission issues, ensure RLS policies are properly set up as shown in the schema file.

## Future Enhancements

Potential improvements that could be added:

1. **Email Notifications**: Send confirmation emails to users and admins
2. **Event Management**: Link RSVPs to specific events
3. **Bulk Operations**: Admin ability to bulk export or manage responses
4. **Analytics**: More detailed analytics and reporting
5. **Integration**: Connect with calendar systems or event platforms

## Support

For technical support or questions about this RSVP system:
- Check the existing GitHub issues
- Review the Supabase documentation for database-related questions
- Test functionality in a development environment before deploying
