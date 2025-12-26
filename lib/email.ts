import { Resend } from "resend"
import { supabaseAdmin } from "./supabase"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const organizationEmail = process.env.ORGANIZATION_EMAIL || "conservation@biodiversity.gm"
// IMPORTANT: You must verify your domain in Resend and set RESEND_FROM_EMAIL
// or use the default onboarding email for testing (only sends to your own email)
const fromEmail = process.env.RESEND_FROM_EMAIL || "Gambia Biodiversity <noreply@gambiabiodiversity.org>"

const BRAND_COLORS = {
  primary: "#2d5a47",
  secondary: "#e2b13c",
  text: "#333333",
  muted: "#666666",
  bg: "#f4f7f5",
  white: "#ffffff"
}

function getBaseEmailTemplate(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${BRAND_COLORS.bg}; color: ${BRAND_COLORS.text}; line-height: 1.6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${BRAND_COLORS.bg}; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${BRAND_COLORS.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <!-- Header -->
                <tr>
                  <td style="background-color: ${BRAND_COLORS.primary}; padding: 30px; text-align: center;">
                    <h1 style="color: ${BRAND_COLORS.white}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                      Gambia Biodiversity Outlook
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: ${BRAND_COLORS.primary}; margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
                      ${title}
                    </h2>
                    <div style="font-size: 16px; color: ${BRAND_COLORS.text};">
                      ${content}
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.muted};">
                      &copy; ${new Date().getFullYear()} Gambia Biodiversity Outlook. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0; font-size: 12px; color: ${BRAND_COLORS.muted};">
                      Department of Parks and Wildlife Management, The Gambia
                    </p>
                    <div style="margin-top: 20px;">
                      <a href="https://gambiabiodiversity.org" style="color: ${BRAND_COLORS.primary}; text-decoration: none; font-weight: 600; font-size: 14px;">Visit Website</a>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Unsubscribe/Notice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 20px;">
                <tr>
                  <td align="center" style="font-size: 12px; color: ${BRAND_COLORS.muted}; padding: 0 20px;">
                    This is an automated message from the Gambia Biodiversity Outlook platform. 
                    Please do not reply directly to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  if (!resend) {
    console.warn("Email service not configured. Missing RESEND_API_KEY.")
    return { success: false, error: "Email service not configured" }
  }

  try {
    console.log('Attempting to send email via Resend to:', to)
    const data = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
      replyTo,
    })
    console.log('Resend response:', data)
    return { success: true, data }
  } catch (error) {
    console.error("Resend error details:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export function getAdminEmailTemplate(type: string, data: any) {
  const typeLabels: Record<string, string> = {
    contact: "General Inquiry",
    support: "ICCA Support Request",
    visit: "Visit Planning Request",
  }

  const label = typeLabels[type] || "New Communication"
  
  const content = `
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
      <table width="100%" border="0" cellspacing="0" cellpadding="5">
        <tr><td width="100"><strong>From:</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Email:</strong></td><td><a href="mailto:${data.email}" style="color: ${BRAND_COLORS.primary};">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ""}
        ${data.target_name ? `<tr><td><strong>Target:</strong></td><td>${data.target_name} (${data.target_type})</td></tr>` : ""}
        ${data.subject ? `<tr><td><strong>Subject:</strong></td><td>${data.subject}</td></tr>` : ""}
      </table>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="color: ${BRAND_COLORS.primary}; font-size: 18px; margin-bottom: 10px;">Message:</h3>
      <div style="background: #ffffff; padding: 20px; border-left: 4px solid ${BRAND_COLORS.primary}; border-radius: 4px; font-style: italic; white-space: pre-wrap; border-top: 1px solid #f0f0f0; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
        "${data.message}"
      </div>
    </div>

    ${data.metadata && Object.keys(data.metadata).length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="color: ${BRAND_COLORS.primary}; font-size: 16px; margin-bottom: 10px;">Additional Details:</h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="5" style="font-size: 14px;">
          ${Object.entries(data.metadata).map(([key, value]) => `
            <tr>
              <td width="150" style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;"><strong>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong></td>
              <td style="border-bottom: 1px solid #f0f0f0; padding: 8px 0;">${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://gambiabiodiversity.org/admin/communications" style="background-color: ${BRAND_COLORS.primary}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        View in Admin Dashboard
      </a>
    </div>
  `

  return getBaseEmailTemplate(label, content)
}

export function getVisitorConfirmationTemplate(type: string, data: any) {
  const typeMessages: Record<string, string> = {
    contact: "Thank you for reaching out to us. We have received your message and will get back to you soon.",
    support: `Thank you for your interest in supporting ${data.target_name || 'our ICCAs'}. We have received your request and will contact you with more information on how you can help.`,
    visit: `Thank you for planning a visit to ${data.target_name || 'our conservation areas'}. We have received your inquiry and our team will assist you with the necessary arrangements.`,
  }

  const message = typeMessages[type] || "Thank you for contacting us. We have received your message."
  
  const content = `
    <p>Dear ${data.name},</p>
    
    <p>${message}</p>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #e9ecef;">
      <h4 style="margin-top: 0; color: ${BRAND_COLORS.primary}; font-size: 16px;">Summary of your request:</h4>
      <table width="100%" border="0" cellspacing="0" cellpadding="5" style="font-size: 14px;">
        <tr><td width="100"><strong>Type:</strong></td><td>${type.charAt(0).toUpperCase() + type.slice(1)}</td></tr>
        ${data.target_name ? `<tr><td><strong>Location:</strong></td><td>${data.target_name}</td></tr>` : ""}
      </table>
      <div style="margin-top: 15px; padding: 15px; background: #ffffff; border-radius: 6px; border: 1px solid #f0f0f0; font-style: italic; color: ${BRAND_COLORS.muted};">
        "${data.message.length > 150 ? data.message.substring(0, 150) + '...' : data.message}"
      </div>
    </div>
    
    <p>Our team typically responds within 2-3 business days. In the meantime, you can explore more about our conservation efforts on our website.</p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="https://gambiabiodiversity.org" style="background-color: ${BRAND_COLORS.primary}; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 10px rgba(45, 90, 71, 0.2);">
        Explore Biodiversity Portal
      </a>
    </div>

    <p style="margin-top: 30px;">Best regards,<br>
    <strong style="color: ${BRAND_COLORS.primary};">The Gambia Biodiversity Team</strong></p>
  `

  return getBaseEmailTemplate("We've Received Your Request", content)
}

export const EMAIL_TEMPLATES = {
  SUPPORT_FOLLOWUP: {
    id: 'support_followup',
    name: 'Support Follow-up',
    subject: 'Following up on your ICCA support request',
    body: (data: any) => `
      <p>Dear ${data.name},</p>
      <p>Thank you for your interest in supporting <strong>${data.target_name || 'our conservation efforts'}</strong>. We are inspired by your willingness to contribute to the protection of Gambia's natural heritage.</p>
      <p>We would love to discuss how you can get involved. Are you available for a brief call this week to discuss the various ways you can contribute?</p>
      <p>In the meantime, you can learn more about our community-led conservation initiatives on our portal.</p>
      <p style="margin-top: 30px;">Best regards,<br>
      <strong style="color: ${BRAND_COLORS.primary};">The Gambia Biodiversity Team</strong></p>
    `
  },
  VISIT_PLANNING: {
    id: 'visit_planning',
    name: 'Visit Planning Guide',
    subject: 'Information for your visit to ${data.target_name}',
    body: (data: any) => `
      <p>Dear ${data.name},</p>
      <p>We are excited that you are planning to visit <strong>${data.target_name || 'our protected areas'}</strong>. Responsible tourism plays a vital role in supporting our conservation work.</p>
      <p>To help you prepare, we've put together a visitor guide which includes information on permits, local guides, and essential items to bring. You can find all the details on our website or by contacting our regional office.</p>
      <p>Please let us know if you have any specific requirements or if you're traveling with a large group.</p>
      <p style="margin-top: 30px;">Best regards,<br>
      <strong style="color: ${BRAND_COLORS.primary};">The Gambia Biodiversity Team</strong></p>
    `
  },
  GENERAL_RESPONSE: {
    id: 'general_response',
    name: 'General Response',
    subject: 'Re: ${data.subject}',
    body: (data: any) => `
      <p>Dear ${data.name},</p>
      <p>Thank you for your inquiry regarding <strong>${data.subject || 'our work'}</strong>.</p>
      <p>We have received your message and it has been forwarded to the relevant department. One of our team members will be in touch shortly with a detailed response to your questions.</p>
      <p>Thank you for your patience and for your interest in Gambia's biodiversity.</p>
      <p style="margin-top: 30px;">Best regards,<br>
      <strong style="color: ${BRAND_COLORS.primary};">The Gambia Biodiversity Team</strong></p>
    `
  }
}

function replacePlaceholders(text: string, data: any) {
  return text.replace(/{{(\w+)}}/g, (_, key) => data[key] || '')
}

export async function getAdminResponseTemplate(templateId: string, data: any) {
  // Try to fetch from database first
  if (supabaseAdmin) {
    const { data: dbTemplate } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (dbTemplate) {
      return {
        subject: replacePlaceholders(dbTemplate.subject, data),
        html: getBaseEmailTemplate(dbTemplate.name, replacePlaceholders(dbTemplate.body, data))
      }
    }
  }

  // Fallback to hardcoded templates
  const template = Object.values(EMAIL_TEMPLATES).find(t => t.id === templateId)
  if (!template) return null

  const subject = template.subject.replace(/\${data\.(\w+)}/g, (_, key) => data[key] || '')
  const body = template.body(data)

  return {
    subject,
    html: getBaseEmailTemplate("Response from Gambia Biodiversity", body)
  }
}

export async function sendAdminResponse(to: string, name: string, templateId: string, customData: any = {}) {
  const template = await getAdminResponseTemplate(templateId, { name, ...customData })
  if (!template) return { success: false, error: "Template not found" }

  return sendEmail({
    to,
    subject: template.subject,
    html: template.html
  })
}
