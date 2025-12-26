import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let query = supabaseAdmin
    .from('resources')
    .select('*, attachments:resource_attachments(*)')
    .order('sort_order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attachments, ...resourceData } = body;

    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (resourceError) throw resourceError;

    if (attachments && attachments.length > 0) {
      const attachmentsToInsert = attachments.map((a: any) => ({
        resource_id: resource.id,
        file_name: a.file_name,
        file_url: a.file_url,
        file_type: a.file_type,
        file_size: a.file_size,
        sort_order: a.sort_order
      }));

      const { error: attachmentsError } = await supabaseAdmin
        .from('resource_attachments')
        .insert(attachmentsToInsert);

      if (attachmentsError) throw attachmentsError;
    }

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
