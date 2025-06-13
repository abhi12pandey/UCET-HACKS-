import nodemailer from "nodemailer"
import { type NextRequest, NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"
import { type sheets_v4, google } from "googleapis"

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

interface MotivationalQuote {
  text: string
  author: string
  category: string
}

// Motivational quotes database
const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "future",
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "coding",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "problem-solving",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "motivation",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "mindset",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "motivation",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "action",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    category: "success",
  },
]

// Email configuration - using the specified email
const emailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  user: "callmepandey03@gmail.com",
  password: process.env.EMAIL_PASSWORD || "",
  fromName: "UCET Hacks 2025",
  fromEmail: "callmepandey03@gmail.com",
}

// Google Sheets configuration
const googleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEET_ID || "",
  range: "Registrations!A:M", // Columns A to M for all our data
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL || "",
  privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
}

// Validation functions
function validateEmail(email: string): string {
  if (!email) return "Email is required"
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return ""
}

function validatePhone(phone: string): string {
  if (!phone) return "Phone number is required"
  if (!/^\d{10}$/.test(phone)) return "Phone number must be exactly 10 digits"
  return ""
}

function validateRequired(value: string, fieldName: string): string {
  if (!value.trim()) return `${fieldName} is required`
  return ""
}

function validateUrl(url: string): string {
  if (!url) return ""
  try {
    new URL(url)
    return ""
  } catch (e) {
    return "Please enter a valid URL"
  }
}

// Validate form data
function validateFormData(data: RegistrationData): FormErrors {
  const errors: FormErrors = {}

  errors.teamLeaderName = validateRequired(data.teamLeaderName, "Team leader name")
  errors.email = validateEmail(data.email)
  errors.phone = validatePhone(data.phone)
  errors.department = validateRequired(data.department, "Department")
  errors.year = validateRequired(data.year, "Year of study")
  errors.teamName = validateRequired(data.teamName, "Team name")
  errors.experience = validateRequired(data.experience, "Experience level")
  errors.motivation = validateRequired(data.motivation, "Motivation")
  errors.presentationLink = validateUrl(data.presentationLink)

  if (!data.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and conditions"
  }

  // Filter out empty errors
  return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== ""))
}

// Get random motivational quote
function getRandomQuote(): MotivationalQuote {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

// Initialize Google Sheets API
async function getGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  try {
    if (!googleSheetsConfig.clientEmail || !googleSheetsConfig.privateKey) {
      throw new Error("Google Sheets credentials are missing. Please check environment variables.")
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: googleSheetsConfig.clientEmail,
        private_key: googleSheetsConfig.privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    return sheets
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error)
    throw new Error("Failed to initialize Google Sheets API")
  }
}

// Save data to Google Sheets
async function saveToGoogleSheets(data: RegistrationData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!googleSheetsConfig.spreadsheetId) {
      throw new Error("Google Sheets ID is missing. Please check environment variables.")
    }

    const sheets = await getGoogleSheetsClient()
    const timestamp = new Date().toISOString()

    // Prepare the row data
    const rowData = [
      timestamp, // A: Registration Date
      data.teamLeaderName, // B: Team Leader Name
      data.email, // C: Email
      data.phone, // D: Phone
      data.college, // E: College
      data.department, // F: Department
      data.year, // G: Year of Study
      data.teamName, // H: Team Name
      data.teamSize, // I: Team Size
      data.experience, // J: Experience
      data.presentationLink || "Not provided", // K: Presentation Link
      data.motivation, // L: Motivation
      "Registered", // M: Status
    ]

    // Check if headers exist, if not create them
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: "Registrations!A1:M1",
    })

    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      // Create headers
      const headers = [
        "Registration Date",
        "Team Leader Name",
        "Email",
        "Phone",
        "College",
        "Department",
        "Year of Study",
        "Team Name",
        "Team Size",
        "Experience",
        "Presentation Link",
        "Motivation",
        "Status",
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: googleSheetsConfig.spreadsheetId,
        range: "Registrations!A1:M1",
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      })
    }

    // Append the new registration data
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: "Registrations!A:M",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowData],
      },
    })

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Google Sheets save error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save data to Google Sheets",
    }
  }
}

// Check if email already exists in Google Sheets
async function checkEmailExists(email: string): Promise<boolean> {
  try {
    if (!googleSheetsConfig.spreadsheetId) {
      return false // If we can't check, allow registration to proceed
    }

    const sheets = await getGoogleSheetsClient()

    // Get all email addresses from column C
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: "Registrations!C:C",
    })

    if (!response.data.values) {
      return false
    }

    // Check if email exists (skip header row)
    const emails = response.data.values.slice(1).flat()
    return emails.includes(email)
  } catch (error) {
    console.error("Error checking email existence:", error)
    return false // If we can't check, allow registration to proceed
  }
}

// Generate email content with motivational quote
function generateEmailContent(data: RegistrationData): { htmlContent: string; textContent: string } {
  const quote = getRandomQuote()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UCET Hacks 2025 - Registration Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
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
            Hello <strong style="color: #1e293b;">${data.teamLeaderName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Congratulations! Your team <strong style="color: #667eea;">"${data.teamName}"</strong> has been successfully registered for UCET Hacks 2025. We're excited to have you join us for this incredible journey of innovation and creativity!
          </p>
          
          <!-- Registration Details -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">📋 Your Registration Details</h3>
            <div style="display: grid; gap: 10px;">
              <div><strong>Team Leader:</strong> ${data.teamLeaderName}</div>
              <div><strong>Email:</strong> ${data.email}</div>
              <div><strong>Phone:</strong> ${data.phone}</div>
              <div><strong>Department:</strong> ${data.department}</div>
              <div><strong>Team Size:</strong> ${data.teamSize} members</div>
              <div><strong>Experience Level:</strong> ${data.experience}</div>
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
          
          <!-- Motivational Quote -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">💡 Inspiration for Your Journey</h4>
            <blockquote style="color: #475569; font-style: italic; margin: 0 0 10px 0; font-size: 16px; line-height: 1.6;">
              "${quote.text}"
            </blockquote>
            <cite style="color: #64748b; font-size: 14px;">— ${quote.author}</cite>
          </div>
          
          <!-- Email Verification Notice -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">📧 Email Verification</h4>
            <p style="color: #b45309; margin: 0; font-size: 14px;">
              This email serves as verification of your registration. Please keep this email for your records.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">© 2025 UCET Hacks | All Rights Reserved</p>
          <p style="color: #64748b; margin: 0; font-size: 12px;">Made with ❤️ by UCET Students | Powered by Innovation</p>
          <div style="margin-top: 20px;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
              Contact us: <a href="mailto:callmepandey03@gmail.com" style="color: #667eea;">callmepandey03@gmail.com</a> | 
              <a href="tel:+919876543210" style="color: #667eea;">+91 9876543210</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
UCET Hacks 2025 - Registration Confirmation

Hello ${data.teamLeaderName},

Congratulations! Your team "${data.teamName}" has been successfully registered for UCET Hacks 2025.

Registration Details:
- Team Leader: ${data.teamLeaderName}
- Email: ${data.email}
- Phone: ${data.phone}
- Department: ${data.department}
- Team Size: ${data.teamSize} members
- Experience Level: ${data.experience}

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

Inspiration for Your Journey:
"${quote.text}" - ${quote.author}

Email Verification:
This email serves as verification of your registration. Please keep this email for your records.

Contact: callmepandey03@gmail.com | +91 9876543210
© 2025 UCET Hacks | All Rights Reserved
  `

  return { htmlContent, textContent }
}

// Send confirmation email
async function sendConfirmationEmail(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email configuration
    if (!emailConfig.password) {
      throw new Error("Email password is missing. Please check EMAIL_PASSWORD environment variable.")
    }

    // Generate email content with motivational quote
    const { htmlContent, textContent } = generateEmailContent(data)

    // Create transporter
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
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      to: data.email,
      subject: "🎉 Welcome to UCET Hacks 2025 - Registration Confirmed & Verified!",
      html: htmlContent,
      text: textContent,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send confirmation email",
    }
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const formData: RegistrationData = await request.json()

    // Validate form data
    const validationErrors = validateFormData(formData)
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fix the validation errors",
          errors: validationErrors,
        },
        { status: 400 },
      )
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email)
    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "This email address is already registered. Please use a different email.",
          errors: { email: "Email already registered" },
        },
        { status: 409 },
      )
    }

    // Save to Google Sheets
    const saveResult = await saveToGoogleSheets(formData)
    if (!saveResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: saveResult.error || "Failed to save registration data. Please try again.",
        },
        { status: 500 },
      )
    }

    // Send confirmation email with verification
    const emailResult = await sendConfirmationEmail(formData)
    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error)
      // Don't fail the registration if email fails, but log it
      return NextResponse.json({
        success: true,
        message:
          "Registration successful! However, there was an issue sending the verification email. Please contact us if you don't receive it within 24 hours.",
        data: saveResult.data,
        emailSent: false,
        emailError: emailResult.error,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! A verification email has been sent to your email address.",
      data: saveResult.data,
      emailSent: true,
      verified: true,
    })
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
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
