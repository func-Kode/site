import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = createRouteHandlerClient({ cookies });
  const updates = await request.json();

  // Only allow admins or owner to update (RLS should enforce this server-side)
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 400 });
  }
  return NextResponse.json({ success: true, message: 'Project updated successfully', projectId: id });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 400 });
  }
  return NextResponse.json({ success: true, message: 'Project deleted successfully', projectId: id });
}