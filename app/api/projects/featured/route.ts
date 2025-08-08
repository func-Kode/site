import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('is_approved', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(6);
        
        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch featured projects' },
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
