import { NextResponse } from "next/server"
import { sendAdminResponse } from "@/lib/email"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { communicationId, templateId, customMessage } = await req.json()

    if (!communicationId || !templateId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase admin client not initialized" },
        { status: 500 }
      )
    }

    // 1. Fetch the communication details
    const { data: communication, error: fetchError } = await (supabaseAdmin
      .from('communications' as any) as any)
      .select('*')
      .eq('id', communicationId)
      .single()

    if (fetchError || !communication) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: "Communication not found" },
        { status: 404 }
      )
    }

    // 2. Send the email
    console.log('Sending admin response to:', (communication as any).email, 'with template:', templateId)
    const emailResult = await sendAdminResponse(
      (communication as any).email,
      (communication as any).name,
      templateId,
      customMessage
    )

    if (!emailResult.success) {
      console.error('Email send failed:', emailResult.error)
      return NextResponse.json(
        { error: "Failed to send email", details: emailResult.error },
        { status: 500 }
      )
    }

    // 3. Update the communication status to 'processed'
    const { error: updateError } = await (supabaseAdmin
      .from('communications' as any) as any)
      .update({ 
        status: 'processed',
        metadata: { 
          ...(communication as any).metadata, 
          replied_at: new Date().toISOString(),
          template_used: templateId
        }
      })
      .eq('id', communicationId)

    if (updateError) {
      console.error('Error updating communication status:', updateError)
      // We don't return error here because the email was already sent
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in admin reply API:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
