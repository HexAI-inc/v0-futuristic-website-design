import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase"
import { sendEmail, getAdminEmailTemplate, getVisitorConfirmationTemplate } from "@/lib/email"

const communicationSchema = z.object({
  type: z.enum(["contact", "support", "visit"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
  target_id: z.string().uuid().optional(),
  target_type: z.enum(["icca", "park", "biosphere"]).optional(),
  target_name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = communicationSchema.parse(body)

    // 1. Store in Database
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client not initialized")
    }

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("communications")
      .insert([
        {
          type: validatedData.type,
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          subject: validatedData.subject || `${validatedData.type.toUpperCase()} Request`,
          message: validatedData.message,
          target_id: validatedData.target_id,
          target_type: validatedData.target_type,
          target_name: validatedData.target_name,
          metadata: validatedData.metadata,
          status: "pending",
        },
      ])
      .select()

    if (dbError) {
      console.error("Database error:", dbError)
      throw new Error("Failed to store communication in database")
    }

    // 2. Send Emails
    const organizationEmail = process.env.ORGANIZATION_EMAIL || "conservation@biodiversity.gm"
    
    // Email to Admin
    const adminHtml = getAdminEmailTemplate(validatedData.type, validatedData)
    await sendEmail({
      to: organizationEmail,
      subject: `[NBSAP ${validatedData.type.toUpperCase()}] ${validatedData.subject || 'New Request'} from ${validatedData.name}`,
      html: adminHtml,
      replyTo: validatedData.email,
    })

    // Confirmation Email to Visitor
    const visitorHtml = getVisitorConfirmationTemplate(validatedData.type, validatedData)
    await sendEmail({
      to: validatedData.email,
      subject: `Confirmation: We received your ${validatedData.type} request`,
      html: visitorHtml,
    })

    return NextResponse.json({
      success: true,
      message: "Communication received and processed successfully",
      id: dbData?.[0]?.id,
    })
  } catch (error) {
    console.error("Communication API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
