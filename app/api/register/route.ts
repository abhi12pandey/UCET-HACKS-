import { google } from "googleapis"
import nodemailer from "nodemailer"
import { type NextRequest, NextResponse } from "next/server"

// Interface for form data
interface RegistrationData {
  teamLeaderName: string
  email: string
  phone: string
  college: string
  department: string
  year: string
  teamName: string
  teamSize: string
  experience: string
  presentationLink: string
  motivation: string
  agreeToTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: "registration" | "reminder" | "announcement" | "winner" | "custom"
  createdAt: string
  updatedAt: string
}

interface MotivationalQuote {
  id: string
  text: string
  author: string
  category: string
}

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  fromName: string
  fromEmail: string
}

// Default email configuration
const defaultEmailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  user: process.env.EMAIL_USER || "",
  password: process.env.EMAIL_PASSWORD || "",
  fromName: "UCET Hacks 2025",
  fromEmail: process.env.EMAIL_USER || "",
}

// Default motivational quotes
const defaultQuotes: MotivationalQuote[] = [
  {
    id: "1",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation",
  },
  {
    id: "2",
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "future",
  },
  {
    id: "3",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "coding",
  },
  {
    id: "4",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "problem-solving",
  },
  {
    id: "5",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion",
  },
]

// Default registration template
const defaultRegistrationTemplate: EmailTemplate = {
  id: "registration-confirmation",
  name: "Registration Confirmation",
  subject: "🎉 Welcome to UCET Hacks 2025 - Registration Confirmed!",
  category: "registration",
  variables: ["teamLeaderName", "teamName", "email", "phone", "department", "teamSize"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  htmlContent: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">UCET Hacks 2025</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">The Genesis of Innovation</p>
      </div>
      
      <!-- Success Icon -->
      <div style="text-align: center; padding: 30px 20px 20px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 36px;">✓</span>
        </div>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 0 30px 40px;">
        <h2 style="color: #1e293b; text-align: center; margin: 0 0 30px 0; font-size: 24px;">Registration Successful!</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello <strong style="color: #1e293b;">{{teamLeaderName}}</strong>,
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
          Congratulations! Your team <strong style="color: #667eea;">"{{teamName}}"</strong> has been successfully registered for UCET Hacks 2025. We're excited to have you join us for this incredible journey of innovation and creativity!
        </p>
        
        <!-- Registration Details -->
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
          <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">📋 Your Registration Details</h3>
          <div style="display: grid; gap: 10px;">
            <div><strong>Team Leader:</strong> {{teamLeaderName}}</div>
            <div><strong>Email:</strong> {{email}}</div>
            <div><strong>Phone:</strong> {{phone}}</div>
            <div><strong>Department:</strong> {{department}}</div>
            <div><strong>Team Size:</strong> {{teamSize}} members</div>
          </div>
        </div>
        
        <!-- Event Details -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
          <h3 style="color: #ffffff; margin: 0 0 20px 0; font-size: 18px;">📅 Event Details</h3>
          <div style="color: #e2e8f0; line-height: 1.8;">
            <div style="margin-bottom: 10px;"><strong>📍 Venue:</strong> UCET VBU Campus, Hazaribagh, Jharkhand</div>
            <div style="margin-bottom: 10px;"><strong>📅 Date:</strong> July 4th, 2025</div>
            <div style="margin-bottom: 10px;"><strong>⏰ Duration:</strong> 9 Hours of Innovation</div>
            <div><strong>🏆 Prize Pool:</strong> To Be Announced</div>
          </div>
        </div>
        
        <!-- What's Next -->
        <div style="background-color: #ecfdf5; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #10b981;">
          <h3 style="color: #065f46; margin: 0 0 20px 0; font-size: 18px;">🚀 What's Next?</h3>
          <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Mark your calendar for July 4th, 2025</li>
            <li>Start brainstorming innovative ideas with your team</li>
            <li>Prepare your development environment and tools</li>
            <li>Follow us on social media for regular updates</li>
            <li>Join our community group (link coming soon)</li>
          </ul>
        </div>
      </div>
      
      <!-- Quote Section -->
      {{motivationalQuote}}
      
      <!-- Footer -->
      <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">© 2025 UCET Hacks | All Rights Reserved</p>
        <p style="color: #64748b; margin: 0; font-size: 12px;">Made with ❤️ by UCET Students</p>
        <div style="margin-top: 20px;">
          <p style="color: #64748b; margin: 0; font-size: 12px;">
            Contact us: <a href="mailto:ucethacks2025@ucet.ac.in" style="color: #667eea;">ucethacks2025@ucet.ac.in</a> | 
            <a href="tel:+919876543210" style="color: #667eea;">+91 9876543210</a>
          </p>
        </div>
      </div>
    </div>
  `,
  textContent: `
UCET Hacks 2025 - Registration Confirmation

Hello {{teamLeaderName}},

Congratulations! Your team "{{teamName}}" has been successfully registered for UCET Hacks 2025.

Registration Details:
- Team Leader: {{teamLeaderName}}
- Email: {{email}}
- Phone: {{phone}}
- Department: {{department}}
- Team Size: {{teamSize}} members

Event Details:
- Venue: UCET VBU Campus, Hazaribagh, Jharkhand
- Date: July 4th, 2025
- Duration: 9 Hours of Innovation
- Prize Pool: To Be Announced

What's Next:
- Mark your calendar for July 4th, 2025
- Start brainstorming innovative ideas with your team
- Prepare your development environment and tools
- Follow us on social media for regular updates

{{motivationalQuoteText}}

Contact: ucethacks2025@ucet.ac.in | +91 9876543210
© 2025 UCET Hacks | All Rights Reserved
  `,
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get random quote
function getRandomQuote(quotes: MotivationalQuote[] = defaultQuotes): MotivationalQuote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// Render template with data and quotes
function renderTemplateWithData(
  template: EmailTemplate,
  data: RegistrationData,
  quotes: MotivationalQuote[] = defaultQuotes,
): { htmlContent: string; textContent: string } {
  const randomQuote = getRandomQuote(quotes)

  // Create quote HTML
  const quoteHtml = `
    <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 20px 30px; border-left: 4px solid #667eea;">
      <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">💡 Inspiration</h4>
      <blockquote style="color: #475569; font-style: italic; margin: 0 0 10px 0; font-size: 16px; line-height: 1.6;">
        "${randomQuote.text}"
      </blockquote>
      <cite style="color: #64748b; font-size: 14px;">— ${randomQuote.author}</cite>
    </div>
  `

  const quoteText = `\n\n"${randomQuote.text}" - ${randomQuote.author}\n`

  // Prepare template data
  const templateData = {
    teamLeaderName: data.teamLeaderName,
    teamName: data.teamName,
    email: data.email,
    phone: data.phone,
    department: data.department,
    teamSize: data.teamSize,
    college: data.college,
    year: data.year,
    experience: data.experience,
    presentationLink: data.presentationLink || "Not provided",
    motivationalQuote: quoteHtml,
    motivationalQuoteText: quoteText,
  }

  let htmlContent = template.htmlContent
  let textContent = template.textContent

  // Replace variables in template
  Object.entries(templateData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    htmlContent = htmlContent.replace(regex, value as string)
    textContent = textContent.replace(regex, value as string)
  })

  return { htmlContent, textContent }
}

// Load email configuration from environment or storage
function getEmailConfig(): EmailConfig {
  // Try to load from environment variables first
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return defaultEmailConfig
  }

  // Fallback to default config (will need to be configured via admin panel)
  return defaultEmailConfig
}

// Load email template from storage or use default
function getRegistrationTemplate(): EmailTemplate {
  // In a real application, this would load from database
  // For now, we'll use the default template
  return defaultRegistrationTemplate
}

// Check if email already exists in the sheet
async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Registrations!B:B", // Column B contains emails
    })

    const values = response.data.values || []
    const emails = values.flat().map((email) => email.toLowerCase())

    return emails.includes(email.toLowerCase())
  } catch (error) {
    console.error("Error checking email existence:", error)
    return false // If we can't check, allow registration to proceed
  }
}

// Set up Google Sheets API
async function appendToSheet(formData: RegistrationData) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Format data for Google Sheets
    const values = [
      [
        formData.teamLeaderName,
        formData.email,
        formData.phone,
        formData.college,
        formData.department,
        formData.year,
        formData.teamName,
        formData.teamSize,
        formData.experience,
        formData.presentationLink || "Not provided",
        formData.motivation,
        new Date().toISOString(),
        "Registered",
      ],
    ]

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Registrations!A:M", // Adjust range as needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error appending to Google Sheet:", error)
    return { success: false, error }
  }
}

// Send confirmation email using template system
async function sendConfirmationEmail(formData: RegistrationData) {
  try {
    const emailConfig = getEmailConfig()
    const template = getRegistrationTemplate()

    // Validate email configuration
    if (!emailConfig.user || !emailConfig.password) {
      throw new Error("Email configuration is incomplete. Please configure SMTP settings.")
    }

    // Render template with registration data
    const { htmlContent, textContent } = renderTemplateWithData(template, formData)

    // Create transporter with configuration
    const transporter = nodemailer.createTransporter({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify transporter configuration
    await transporter.verify()

    const mailOptions = {
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail || emailConfig.user}>`,
      to: formData.email,
      cc: "callmepandey03@gmail.com", // Adding the Google account as CC
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const formData: RegistrationData = await request.json()

    // Validate required fields
    const requiredFields = [
      "teamLeaderName",
      "email",
      "phone",
      "department",
      "year",
      "teamName",
      "experience",
      "motivation",
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof RegistrationData]) {
        return NextResponse.json({ success: false, message: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone)) {
      return NextResponse.json({ success: false, message: "Phone number must be exactly 10 digits" }, { status: 400 })
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email)
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "This email address is already registered. Please use a different email." },
        { status: 409 },
      )
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      return NextResponse.json(
        { success: false, message: "You must agree to the terms and conditions" },
        { status: 400 },
      )
    }

    // Validate presentation link if provided
    if (formData.presentationLink) {
      try {
        new URL(formData.presentationLink)
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid presentation link URL" },
          { status: 400 },
        )
      }
    }

    // Append to Google Sheet
    const sheetResult = await appendToSheet(formData)
    if (!sheetResult.success) {
      console.error("Failed to save to Google Sheet:", sheetResult.error)
      return NextResponse.json(
        { success: false, message: "Failed to save registration data. Please try again." },
        { status: 500 },
      )
    }

    // Send confirmation email using template system
    const emailResult = await sendConfirmationEmail(formData)

    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error)
      // Don't fail the registration if email fails, but log it
      return NextResponse.json({
        success: true,
        message:
          "Registration successful! However, there was an issue sending the confirmation email. Please contact us if you don't receive it within 24 hours.",
        emailSent: false,
        emailError: emailResult.error,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! A confirmation email has been sent to your email address.",
      emailSent: true,
    })
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
