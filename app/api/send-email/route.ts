import nodemailer from "nodemailer"
import { type NextRequest, NextResponse } from "next/server"

interface EmailRequest {
  to: string
  subject: string
  htmlContent: string
  textContent: string
  config: {
    host: string
    port: number
    secure: boolean
    user: string
    password: string
    fromName: string
    fromEmail: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, htmlContent, textContent, config }: EmailRequest = await request.json()

    // Validate required fields
    if (!to || !subject || !config.user || !config.password) {
      return NextResponse.json({ success: false, message: "Missing required email parameters" }, { status: 400 })
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify transporter
    await transporter.verify()

    // Send email
    const result = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail || config.user}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent,
    })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    )
  }
}
