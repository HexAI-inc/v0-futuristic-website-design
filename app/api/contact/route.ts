import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(20),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    const { name, email, organization, subject, message } = validatedData

    // Send email to the organization
    const organizationEmail = process.env.ORGANIZATION_EMAIL || "conservation@biodiversity.gm"
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a47; border-bottom: 2px solid #2d5a47; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #2d5a47;">Message:</h3>
          <p style="background: #ffffff; padding: 15px; border-left: 4px solid #2d5a47; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <hr style="border: 1px solid #e9ecef; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d;">
          This message was sent through the contact form on Gambia's Biodiversity Outlook website.
          <br>
          Received: ${new Date().toLocaleString()}
        </p>
      </div>
    `

    // Check if email service is configured
    if (!resend) {
      console.warn("Email service not configured. Skipping email send.")
      return NextResponse.json({ 
        success: true, 
        message: "Message received (email service not configured)" 
      })
    }

    await resend.emails.send({
      from: "Gambia Biodiversity <noreply@gambiabiodiversity.org>",
      to: [organizationEmail],
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      replyTo: email,
    })

    // Send confirmation email to the sender
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5a47; border-bottom: 2px solid #2d5a47; padding-bottom: 10px;">
          Thank You for Contacting Us!
        </h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for reaching out to Gambia's Biodiversity Outlook. We have received your message and appreciate your interest in our conservation efforts.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your message:</strong></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="background: #ffffff; padding: 10px; border-left: 4px solid #2d5a47;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <p>We typically respond within 2-3 business days. If your inquiry is urgent, please call us at +220 446 1100.</p>
        
        <p>Best regards,<br>
        The Gambia Biodiversity Team</p>
        
        <hr style="border: 1px solid #e9ecef; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d;">
          This is an automated confirmation email. Please do not reply to this message.
          <br>
          Visit us: <a href="https://gambiabiodiversity.org" style="color: #2d5a47;">gambiabiodiversity.org</a>
        </p>
      </div>
    `

    await resend.emails.send({
      from: "Gambia Biodiversity <noreply@gambiabiodiversity.org>",
      to: [email],
      subject: "Thank you for contacting Gambia's Biodiversity Outlook",
      html: confirmationHtml,
    })

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully" 
    })

  } catch (error) {
    console.error("Contact form error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}