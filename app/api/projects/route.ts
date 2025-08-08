import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query = supabase
      .from('projects')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ projects: data ?? [], total: data?.length ?? 0, filtered: data?.length ?? 0 });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to submit a project.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const required = ['title', 'description', 'longDescription', 'githubUrl', 'language', 'authorName', 'authorEmail', 'tags'];
    const missing = required.filter((k) => !body[k] || (Array.isArray(body[k]) && body[k].length === 0));
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    if (!String(body.githubUrl).includes('github.com')) {
      return NextResponse.json({ error: 'Please provide a valid GitHub URL' }, { status: 400 });
    }
    if (body.liveUrl && !/^https?:\/\//i.test(String(body.liveUrl))) {
      return NextResponse.json({ error: 'Please provide a valid live demo URL (must start with http or https)' }, { status: 400 });
    }

    // Map camelCase payload to snake_case DB columns
    const payload = {
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      long_description: String(body.longDescription).trim(),
      github_url: String(body.githubUrl).trim(),
      live_url: body.liveUrl ? String(body.liveUrl).trim() : null,
      tags: Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean) : [],
      language: String(body.language).trim(),
      category: String(body.category ?? 'Web App').trim(),
      difficulty: String(body.difficulty ?? 'Intermediate').trim(),
      author_name: String(body.authorName).trim(),
      author_email: String(body.authorEmail).trim(),
      user_id: user.id,
      is_featured: false,
      is_approved: false,
    } as const;

    const { data, error } = await supabase.from('projects').insert([payload]).select('id').single();
    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to submit project' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project submitted successfully! Our team will review it soon.',
      projectId: data?.id,
      redirectUrl: '/projects',
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}