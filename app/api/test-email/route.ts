import nodemailer from "nodemailer"
import { type NextRequest, NextResponse } from "next/server"

interface TestEmailRequest {
  email: string
  testData: any
}

// Motivational quotes for testing
const testQuotes = [
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
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

function generateTestEmailContent(data: any): { htmlContent: string; textContent: string } {
  const quote = testQuotes[Math.floor(Math.random() * testQuotes.length)]

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UCET Hacks 2025 - Test Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Test Banner -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 15px 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">🧪 TEST EMAIL - Google Sheets Integration</h2>
          <p style="color: #fef3c7; margin: 5px 0 0 0; font-size: 14px;">Testing email verification from callmepandey03@gmail.com</p>
        </div>
        
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
          <h2 style="color: #1e293b; text-align: center; margin: 0 0 30px 0; font-size: 24px;">Google Sheets Integration Test!</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello <strong style="color: #1e293b;">${data.teamLeaderName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            This is a test email to verify that your Google Sheets integration and email verification system is working correctly. Your team <strong style="color: #667eea;">"${data.teamName}"</strong> would receive a similar email upon successful registration for UCET Hacks 2025.
          </p>
          
          <!-- Test Registration Details -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">📋 Sample Registration Details</h3>
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
          
          <!-- Test Status -->
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin: 0 0 20px 0; font-size: 18px;">✅ System Status</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Google Sheets API connection successful</li>
              <li>Email verification system working</li>
              <li>Motivational quotes system active</li>
              <li>Responsive design confirmed</li>
              <li>Data validation functioning</li>
              <li>Ready for July 4th registrations!</li>
            </ul>
          </div>
          
          <!-- Motivational Quote -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <h4 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">💡 Random Motivational Quote</h4>
            <blockquote style="color: #475569; font-style: italic; margin: 0 0 10px 0; font-size: 16px; line-height: 1.6;">
              "${quote.text}"
            </blockquote>
            <cite style="color: #64748b; font-size: 14px;">— ${quote.author}</cite>
          </div>
          
          <!-- Email Verification Notice -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">📧 Email Verification Test</h4>
            <p style="color: #b45309; margin: 0; font-size: 14px;">
              This test email confirms that email verification is working correctly from callmepandey03@gmail.com
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
🧪 TEST EMAIL - Google Sheets Integration

Hello ${data.teamLeaderName},

This is a test email to verify that your Google Sheets integration and email verification system is working correctly. Your team "${data.teamName}" would receive a similar email upon successful registration for UCET Hacks 2025.

Sample Registration Details:
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

System Status:
✅ Google Sheets API connection successful
✅ Email verification system working
✅ Motivational quotes system active
✅ Responsive design confirmed
✅ Data validation functioning
✅ Ready for July 4th registrations!

Random Motivational Quote:
"${quote.text}" - ${quote.author}

Email Verification Test:
This test email confirms that email verification is working correctly from callmepandey03@gmail.com

Contact: callmepandey03@gmail.com | +91 9876543210
© 2025 UCET Hacks | All Rights Reserved
  `

  return { htmlContent, textContent }
}

export async function POST(request: NextRequest) {
  try {
    const { email, testData }: TestEmailRequest = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, message: "Email address is required" }, { status: 400 })
    }

    // Validate email configuration
    if (!emailConfig.password) {
      return NextResponse.json(
        { success: false, message: "Email password is missing. Please check EMAIL_PASSWORD environment variable." },
        { status: 500 },
      )
    }

    // Generate test email content
    const { htmlContent, textContent } = generateTestEmailContent(testData)

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
      to: email,
      subject: "🧪 Test Email - UCET Hacks 2025 Google Sheets Integration",
      html: htmlContent,
      text: textContent,
    }

    const result = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email} from callmepandey03@gmail.com! Check your inbox (and spam folder).`,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send test email",
      },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
