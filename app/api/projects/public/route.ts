import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');
        
        // Build query
        let query = supabase
            .from('projects')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });
        
        // Apply filters
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
        
        const { data: projects, error } = await query;
        
        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch projects' },
                { status: 500 }
            );
        }
        
        return NextResponse.json({ projects });
        
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
