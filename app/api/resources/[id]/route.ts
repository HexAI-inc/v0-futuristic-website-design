import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*, attachments:resource_attachments(*)')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { attachments, ...resourceData } = body;

    // Update resource
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .update(resourceData)
      .eq('id', params.id)
      .select()
      .single();

    if (resourceError) throw resourceError;

    // Handle attachments
    if (attachments) {
      // Delete existing attachments
      await supabaseAdmin
        .from('resource_attachments')
        .delete()
        .eq('resource_id', params.id);

      if (attachments.length > 0) {
        const attachmentsToInsert = attachments.map((a: any) => ({
          resource_id: params.id,
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
    }

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
