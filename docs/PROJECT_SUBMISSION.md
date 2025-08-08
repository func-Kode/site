# 🚀 Project Submission System

This document explains the complete project submission workflow that allows users to submit their projects for showcase on the func(Kode) platform.

## 📋 Features

- **Authentication Required**: Users must be logged in to submit projects
- **Form Validation**: Comprehensive client and server-side validation
- **Admin Approval**: Projects require admin approval before being displayed publicly
- **Featured Projects**: Admins can mark projects as featured for special highlighting
- **Automatic Redirects**: Users are redirected after successful submissions
- **Error Handling**: Clear error messages and status feedback

## 🔄 User Flow

### 1. Project Submission (`/submit-project`)
- User visits `/submit-project`
- If not authenticated, redirected to `/auth/login?redirect=/submit-project`
- After login, user fills out the project submission form:
  - **Basic Info**: Title, Description, Detailed Description
  - **URLs**: GitHub repository (required), Live demo (optional)
  - **Metadata**: Tags, Primary Language, Category, Difficulty
  - **Author Info**: Pre-filled from user profile, editable

### 2. Submission Processing
- Form data validated on client-side
- POST request to `/api/projects` with authentication token
- Server validates user authentication and data
- Project stored in database with `is_approved: false`
- User redirected to `/projects` with success message

### 3. Admin Review (`/admin/projects`)
- Admins can view all submitted projects
- Approve/unapprove projects
- Mark projects as featured/unfeatured
- View project statistics (views, likes)

### 4. Public Display (`/projects`)
- Only approved projects are displayed publicly
- Featured projects shown in special section
- Filtering by category, difficulty, and search
- Links to GitHub and live demos

## 🛠️ Technical Implementation

### Database Schema
```sql
-- Projects table (see database/schema.sql for complete schema)
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT,
    tags TEXT[] NOT NULL,
    language TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
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
```

### API Endpoints

#### `POST /api/projects`
Submit a new project (authenticated users only)

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Short description",
  "longDescription": "Detailed description",
  "githubUrl": "https://github.com/user/repo",
  "liveUrl": "https://demo.com",
  "tags": ["React", "TypeScript"],
  "language": "TypeScript",
  "category": "Web App",
  "difficulty": "Intermediate",
  "authorName": "John Doe",
  "authorEmail": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Project submitted successfully",
  "id": "project-uuid"
}
```

#### `GET /api/projects/public`
Fetch approved projects with filtering

**Query Parameters:**
- `category`: Filter by category
- `difficulty`: Filter by difficulty
- `featured`: Show only featured projects
- `search`: Search in title and description

#### `GET /api/projects/featured`
Fetch featured projects only

### Security Features

1. **Row Level Security (RLS)**: Database policies ensure users can only modify their own projects
2. **Authentication Validation**: All API routes validate user authentication
3. **Input Sanitization**: Server-side validation of all input data
4. **Admin Authorization**: Admin-only operations protected by user email/username checks

## 🎨 UI Components

### Submission Form
- **Responsive Design**: Mobile-first with desktop enhancements
- **Real-time Validation**: Instant feedback on form errors
- **Loading States**: Visual feedback during submission
- **Success/Error Messages**: Clear status communication

### Projects Display
- **Grid Layout**: Responsive card-based layout
- **Filtering System**: Category, difficulty, and search filters
- **Featured Section**: Special highlighting for featured projects
- **Stats Display**: GitHub stars, forks, and contributor counts

### Admin Panel
- **Project Management**: Approve, feature, and manage projects
- **Bulk Operations**: Efficiently manage multiple projects
- **Status Indicators**: Clear visual status of each project

## 🚀 Setup Instructions

### 1. Database Setup
Run the SQL schema in your Supabase dashboard:
```bash
# Copy contents of database/schema.sql to Supabase SQL Editor
```

### 2. Environment Variables
Ensure your `.env.local` includes:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Test the Flow
1. Start the development server: `npm run dev`
2. Navigate to `/submit-project`
3. Log in with GitHub OAuth
4. Submit a test project
5. Check `/admin/projects` to approve it
6. View it on `/projects` page

## 🔧 Configuration

### Project Categories
Currently supported categories (defined in both frontend and database):
- Web App
- Mobile App
- CLI Tool
- Library
- Game
- AI/ML

### Difficulty Levels
- Beginner
- Intermediate
- Advanced

### Admin Users
Admin status is determined by:
- Email: `vvs.pedapati@rediffmail.com`
- GitHub username: `basanth-pedapati`

To add more admins, update the checks in:
- `/app/admin/projects/page.tsx`
- Database RLS policies in `schema.sql`

## 📊 Future Enhancements

- [ ] Project statistics tracking (views, likes)
- [ ] User project dashboard
- [ ] Project comments and reviews
- [ ] GitHub integration for automatic project updates
- [ ] Advanced search with tags and filters
- [ ] Project collaboration features
- [ ] API rate limiting and caching
- [ ] Image uploads for project screenshots
- [ ] Email notifications for approval status
- [ ] Project submission analytics

## 🐛 Troubleshooting

### "Access Denied" on Admin Panel
- Verify your user email or GitHub username matches admin configuration
- Check if you're properly logged in

### Project Submission Fails
- Check browser console for error messages
- Verify all required fields are filled
- Ensure GitHub URL is valid and accessible
- Check if database schema is properly applied

### Projects Not Displaying
- Verify projects are approved in admin panel
- Check if database policies are correctly set up
- Ensure API endpoints are accessible

For more help, check the browser developer console or server logs for detailed error messages.
